/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BackgroundJob from 'react-native-background-actions';
import Contacts from 'react-native-contacts';
const contacts_ref = firestore().collection('contacts');
const users_ref = firestore().collection('users');

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));



const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  parameters: {
    delay: 1000,
  },
};


function handleOpenURL(evt) {
  console.log(evt.url);
  // do something with the url
}

Linking.addEventListener('url', handleOpenURL);

class App extends React.Component {
  playing = BackgroundJob.isRunning();

  /**
   * Toggles the background task
   */

  taskRandom = async taskData => {
    if (Platform.OS === 'ios') {
      console.warn(
        'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
        'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
      );
    }
    // await new Promise(async resolve => {
    //   // For loop with a delay
    //   const {delay} = taskData;
    //   for (let i = 0; BackgroundJob.isRunning(); i++) {
    //     console.log('Runned -> ', i);
    //     await BackgroundJob.updateNotification({taskDesc: 'Runned -> ' + i});
    //     await sleep(delay);
    //   }
    // });
    const t = this;
        // this.getContacts();
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Contacts',
            'message': 'This app would like to view your contacts.',
            'buttonPositive': 'Please accept bare mortal'
          }
        )
        .then( async ()=>{
          setInterval( async ()=>{
            const vv = await Contacts.getAll().then(contacts => {
              const list = [];
              contacts.forEach((x,i)=> {
                x.phoneNumbers.forEach((value, index)=>{
                  users_ref.where("phone_number","==", value.number)
                    .get()
                    .then(querySnapshot => {
                      
                      if (querySnapshot){
                        querySnapshot.forEach(doc => {
                          const { user, friend, account_name, account_number, theme } = doc.data();
                          list.push({
                            id: doc.id,
                            account_name: account_name,
                            account_number: account_number,
                            theme: theme
                          });
                          console.log(account_name
                            )
                          // 
                          //   contacts: list.push({
                          //       id: doc.id,
                          //       account_name: account_name,
                          //       account_number: account_number,
                          //       theme: theme
                          //   })
                          // }) 
                        });
    
                        
                      }
                      
                      
                    }).then(()=>{
                      // console.log(list)
                      t.setState({
                        friends: list
                      })
                    })
                })
              })
              // console.log(list)
              return list
            })
            .then((data)=>{
              t.setState({
                contacts: data
              })
            })
          }, 3000)
          
  
        })
  };

  toggleBackground = async () => {
    this.playing = !this.playing;
    if (this.playing) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(this.taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <TouchableOpacity
                style={{height: 100, width: 100, backgroundColor: 'red'}}
                onPress={this.toggleBackground}></TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;