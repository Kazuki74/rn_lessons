import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Button, Modal, Alert, SectionList, RefreshControl } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // 記事データを入れるための配列
      threads: [],
      refreshing: false
    }
  }
  componentDidMount() {
    this.refreshList()
  }
  refreshList() {
    this.setState({refreshing: true})
    fetch("https://www.reddit.com/r/newsokur/hot.json")
    .then((responce) => responce.json())
    .then((responseJson) => {
      let threads = responseJson.data.children
      threads = threads.map(i => {
        i.key = i.data.url
        return i
      })
      this.setState({threads: threads, refreshing: false})
    })
    .catch((error) => {
      console.error(error);
    })
  }

  render() {
    const { threads} = this.state
    // Dimensionsから画面幅を取得
    const { width, height, scale } = Dimensions.get('window')
    return (
      <React.Fragment>
        <View style={styles.container}>
          <FlatList
            refreshControl={
              <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refreshList.bind(this)}
              />
            }
            data={threads}
            renderItem={thread => {
              return (
                <View style={styles.view}>
                  <Image style={styles.image}/>
                  <Text style={{width: width - 50}} key={thread.key}>{thread.item.data.title}</Text>
                </View>
              )
            }}
          />
        </View>
      </React.Fragment>
    );
  }
}

// -の代わりにキャメルケース
// 基本の単位はdp
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F5FCFF",
    paddingTop: 16,
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    width: "100%",
  },
  image: {
    width: 50,
    height: 50,
  },
});
