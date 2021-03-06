import React, { Component } from 'react'
import { Animated, Dimensions, InteractionManager, PanResponder, Text, TouchableOpacity, View } from 'react-native'

import styles from '../styles'

import PointCircle from './PointCircle'

export default class PointRow extends Component {
  constructor(props) {
    super(props)
    /*
    title
    subtitle
    value
    outOfValue
    onPress
    onEditPress
    onDeletePress
    */

    const screen = Dimensions.get('window')
    this.state = {
      open: false,
      width: 0,
      height: 0,
      sensitivity: 5,
      screenWidth: screen.width,
      screenHeight: screen.height,
      rowPan: new Animated.Value(0),
      opacityPan: new Animated.Value(0)
    }
  }

  _reset() {
    this.setState({ open: false })
    Animated.timing(this.state.rowPan, { toValue: 0, duration: 250 }).start()
    Animated.timing(this.state.opacityPan, { toValue: 0, duration: 250 }).start()
  }

  _open() {
    this.setState({ open: true })
    Animated.timing(this.state.rowPan, { toValue: -80, duration: 250 }).start()
    Animated.timing(this.state.opacityPan, { toValue: 1, duration: 250 }).start()
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) =>
        (Math.abs(gestureState.dx) > this.state.sensitivity &&
        Math.abs(gestureState.dy) < 6*this.state.sensitivity) ||
        Math.abs(gestureState.dx) > 50,
      onPanResponderGrant: () => true,
      onPanResponderMove: (event, gestureState) => {
        let dx = gestureState.dx
        if (this.state.open) dx -= 80

        // Row sliding
        this.state.rowPan.setValue(dx)

        // Side button opacity
        let opacity = dx/-80
        if (opacity > 1) opacity = 1
        else if (opacity < 0) opacity = 0
        this.state.opacityPan.setValue(opacity)
      },
      onPanResponderRelease: (event, gestureState) => {
        if (this.state.rowPan._value < -50 || gestureState.vx > 1 && this.state.rowPan._value < 0) {
          // Swipe <--
          this._open()
        }
        else {
          this._reset()
        }
      },
      onPanResponderTerminate: () => this._reset()
    })
  }

  onPress = () => {
    this._reset()
    InteractionManager.runAfterInteractions(() => {
      this.props.onPress()
    })
  }

  onEditPress = () => {
    this._reset()
    InteractionManager.runAfterInteractions(() => {
      this.props.onEditPress()
    })
  }

  onDeletePress = () => {
    this._reset()
    InteractionManager.runAfterInteractions(() => {
      this.props.onDeletePress()
    })
  }

  render() {
    return (
      <View {...this._panResponder.panHandlers}>
        <Animated.View style={[styles.pointRowContainer, { transform: [{ translateX: this.state.rowPan }] }]}>
          <TouchableOpacity
            style={styles.pointRow}
            onPress={this.onPress}
          >
            <View style={styles.pointRowCircle}>
              <PointCircle value={this.props.value} />
            </View>
            <View style={styles.pointRowSection}>
              <Text style={styles.rowTitle}>{this.props.title}</Text>
              <View style={styles.rowSubtitle}>
                <Text style={styles.rowSubtitleText}>{this.props.subtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.rowSlidein, { opacity: this.state.opacityPan }]} pointerEvents={(this.state.open)? 'auto' : 'none'}>
          <TouchableOpacity
            style={styles.rowSlideinButton}
            onPress={this.onEditPress}
          >
            <View >
              <Text style={styles.rowSlideinButtonText}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowSlideinButton}
            onPress={this.onDeletePress}
          >
            <Text style={styles.rowSlideinButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}
