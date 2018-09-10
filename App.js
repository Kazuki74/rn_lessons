import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, Button, Modal, Alert } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      // 記事データを入れるための配列
      threads: [],
      isLoading: true,
      isVisible: false,
      color: '#fff'
    }
  }
  showModal() {
    this.setState({isVisible: true})
  }
  closeModal() {
    this.setState({isVisible: false})
  }
  showAlert() {
    Alert.alert(
      'Alert title',
      'My Alert Msg',
      [
        {
          text: 'Blue', onPress: () => this.changeBGColor("#00f")
        },
        {
          text: 'Red', onPress: () => this.changeBGColor("#f00")
        },
        {
          text: 'Green', onPress: () => this.changeBGColor("#0f0")
        }
      ],
        { cancelable: false }
    )
  }
  changeBGColor(hex) {
    this.setState({color: hex})
  }
  componentDidMount() {
    fetch("https://www.reddit.com/r/newsokur/hot.json")
      .then((response) => response.json())
      .then((responseJson) => {
        let threads = responseJson.data.children
        threads = threads.map(i =>{
          i.key = i.data.url
          return i
        })
        this.setState({threads: threads, isLoading: false})
      })
      .catch((error) => {
        console.log(error);
      })
  }
  render() {
    const { threads, isLoading, color } = this.state
    // Dimensionsから画面幅を取得
    const { width } = Dimensions.get('window')
    return (
      <React.Fragment>
        <View style={styles.modal}>
          <Modal
           visible={this.state.isVisible}
           transparent={false}
           animationType={"fade" || "slide"}
           presentationStyle={'fullScreen' || 'pageSheet' || 'formSheet' || 'overFullscreen'}
          >
            <View style={styles.modalButton}>
              <Button onPress={()=>this.closeModal()} title="close modal"/>
            </View>
          </Modal>
          <Button onPress={()=>this.showModal()} title="show modal"/>
        </View>
        <View style={styles.alert}>
          <Button onPress={()=>this.showAlert()} title={"Show Alert"}/>
        </View>
        <View style={styles.list}>
          { isLoading? <ActivityIndicator/> :
            <FlatList data={ threads } renderItem={ ({item}) => {
              return (
                <View style={styles.items}>
                  <Image style={styles.image} source={{uri: item.data.thumbnail}}/>
                  <View style={{ width: width - 50, backgroundColor: color }}>
                    <Text>{item.data.title}</Text>
                    <Text style= {styles.domain}>{item.data.domain}</Text>
                  </View>
                </View>
              )
            }} />
          }
        </View>
      </React.Fragment>
    );
  }
}

// -の代わりにキャメルケース
// 基本の単位はdp
const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  items: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  image: {
    // 画像表示には幅と高さの指定が必要
    width: 50,
    height: 50,
  },
  domain: {
    color: '#ababab',
    fontSize: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  alert: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
