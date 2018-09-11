import React, { Component } from 'react';
import {
  View,
  Image,
  ImageStore,
  Button,
  ImageEditor,
  StyleSheet
} from 'react-native';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      position: {},
      uri: ""
    }
  }

  cropImage(uri) {
    Image.getSize(uri, (width, height) => {
      let cropData = {
        offset: {
          y: height / 3,
          x: width / 3
        },
        size: {
          height: height / 3,
          width: width / 3
        },
      }
    ImageEditor.cropImage(
      uri,
      cropData,
      (result) => {
        ImageStore.hasImageFortag(result, (hasImage) => {
          if(hasImage > 0){
            this.setState({uri: result})
          }
        },
        (e) => {
          console.warn(e)
        })
      },
      (e) => {
        console.warn(e)
      }
      )
    })
  }

  render() {
    const { position, uri } = this.state
    const styles = StyleSheet.create({
      view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      image: {
        width: 50,
        height: 50,
      }
    })

    return (
      <View style={styles.view}>
        <Image style={styles.image} source={{uri: 'https://www.pakutaso.com/shared/img/thumb/PAK160428140I9A3615_TP_V.jpg'}} />
        <Button
          onPress{() => {this.cropImage('https://www.pakutaso.com/shared/img/thumb/PAK160428140I9A3615_TP_V.jpg')}}
          title={ "crop a picture" }
        />
      </View>
    )
  }
}

