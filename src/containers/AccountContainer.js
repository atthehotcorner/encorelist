import React, { Component } from 'react'
import { Alert, Button, ScrollView, Text, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import * as AccountActions from '../actions/account'

import styles from '../styles'
import Diamond from '../components/Diamond'

class AccountContainer extends Component {
  constructor(props) {
    super(props)
  }

  logout() {
    Alert.alert(
      'Log Out',
      'Do you want to log out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.props.logout().then(() => {
            Actions.onboarding()
          })
        }}
      ]
    )
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>{this.props.name}</Text>
          <Text>{this.props.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Points Available</Text>
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsDisplayText}>{this.props.points}</Text>
            <Diamond size={27} />
            <Text style={[styles.pointsDisplayText, styles.pointsDisplayBold]}>pts</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Points Redeemed</Text>
          <View style={styles.pointsDisplay}>
            <Text style={styles.pointsDisplayText}>{this.props.redeemedPoints}</Text>
            <Diamond size={27} />
            <Text style={[styles.pointsDisplayText, styles.pointsDisplayBold]}>pts</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Button
            title="Log Out"
            onPress={() => this.logout()}
          />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.account
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(AccountActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer)
