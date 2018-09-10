import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Button, Modal, Alert, SectionList, RefreshControl } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // 記事データを入れるための配列
      threads: [],
      refleshing: false
    }
  }
  componentDidMount() {
    this.fetchThreads()
  }
  _fetchThread(item) {
    return new Promise((resolve, reject)=> {
      fetch(item.uri)
      .then((response) => response.json())
      .then((responseJson) => {
        let threads = responseJson.data.children.slice(0, 5)
        threads = threads.map(i => {
          i.key = i.data.url
          return i
        })
        return resolve({
          data: threads,
          title: item.title
        })
        .catch((error) => {
          return reject(error);
        })
      })
    })
  }
  fetchThreads() {
    let list = [
      {
        uri: "https://www.reddit.com/r/newsokur/hot.json",
        title: "人気"
      },
      {
        uri: "https://www.reddit.com/r/newsokur/controversial.json",
        title: "議論中"
      }
    ]
    Promise.all(list.map(i => this._fetchThread(i)))
    .then(r => {
      this.setState({threads: r})
    }).catch(e => {
      console.warn(e)
    })
  }

  render() {
    const { threads, isLoading } = this.state
    // Dimensionsから画面幅を取得
    const { width, height, scale } = Dimensions.get('window')
    return (
      <React.Fragment>
        <View style={styles.container}>
          <SectionList
            renderItem={thread => {
              return (
                <View style={{flex:1, flexDirection:'row', width:"100%"}}>
                  <Image style={{width: 50, height: 50}} source={{ uri: thread.item.data.thumbnail}}/>
                  <Text style={{width: width - 50}} key={thread.key}>{thread.item.data.title}</Text>
                </View>
              )
            }}
            renderSectionHeader={({section}) => <Text> {section.title} </Text>}
            sections = {threads}
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
    paddingTop: 20,
  }
});
