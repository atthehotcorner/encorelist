import React, { Component } from 'react'
import { ListView, StyleSheet, Text } from 'react-native'

import ListsHeader from './ListsHeader'
import ListsRow from './ListsRow'
import ListsAddRow from './ListsAddRow'
import ListsRowPlaceholder from '../components/ListsRowPlaceholder'

export default class Lists extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  }

  componentWillReceiveProps(nextProps) {
    this.dataSource = this.dataSource.cloneWithRows(nextProps.lists)
  }

  render() {
    if (this.props.loading) return <ListsRowPlaceholder />

    let header
    if (this.props.lists.length < 1) {
      header = (
        <Text style={styles.message}>
          No list :(
        </Text>
      )
    }
    else {
      header = (
        <ListsHeader/>
      )
    }

    return (
      <ListView
        dataSource={this.dataSource}
        enableEmptySections={true}
        renderHeader={() => header}
        renderFooter={() => <ListsAddRow gotoAddList={this.props.gotoAddList} />}
        renderRow={(rowData) => <ListsRow {...rowData} gotoList={this.props.gotoList} gotoRemoveList={this.props.gotoRemoveList} />}
      />
    )
  }
}

const styles = StyleSheet.create({
  message: {
    padding: 16
  }
})
