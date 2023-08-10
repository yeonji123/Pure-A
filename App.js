
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef, } from 'react';
import { View, StyleSheet, Text, } from 'react-native';

import Main from './Pages/Main/Main';
import Main2 from './Pages/Main/Main2';
import Join from './Pages/SignUp/Join';
import SignUp from './Pages/SignUp/SignUp';
import Login from './Pages/SignUp/Login';
import Map from './Pages/Map/Map';
import QRCodeScanner from "./Pages/Scanner/QRCodeScanner";
import UserInfo from "./Pages/Info/UserInfo";
import CameraCheck from './Pages/Scanner/CameraCheck';
import CustMain from "./Pages/Service/CustMain";
import BreakReport from "./Pages/Service/BreakReport";
import MyDonation from "./Pages/Service/MyDonation";
import RentalReturnReport from "./Pages/Service/RentalReturnReport";
import FunctionList from "./Pages/MainFunction/FunctionList";
import Rental from "./Pages/MainFunction/Rental";
import RentalPage from "./Pages/MainFunction/RentalPage";
import ExplainPage from "./Pages/MainFunction/ExplainPage";
import DonationPage from "./Pages/MainFunction/DonationPage";
import ReturnPage from "./Pages/MainFunction/ReturnPage";
import ScanStation from './Pages/Service/ScanStation';
import Loading from './Component/Loading';
import ReposrtList from './Pages/Service/ReportList';
import MapView from './Pages/Map/MapView';
import SearchStation from './Pages/Map/SearchStation';


import 'expo-dev-client';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// import Text from './Component/DefaultText';
const Stack = createStackNavigator();
// expo install react-native-safe-area-context
// npm install @react-navigation/native
// expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view



export default function App() {
  
    return (
      <>
        <StatusBar style="auto" />
        <NavigationContainer>
          <Stack.Navigator initialization="Main">
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Join" component={Join} />
            <Stack.Screen name='SignUp' component={SignUp} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="QRCodeScanner" component={QRCodeScanner} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="CustMain" component={CustMain} />
            <Stack.Screen name="UserInfo" component={UserInfo} />
            <Stack.Screen name="CameraCheck" component={CameraCheck} />
            <Stack.Screen name="BreakReport" component={BreakReport} />
            <Stack.Screen name="MyDonation" component={MyDonation} />
            <Stack.Screen name="RentalReturnReport" component={RentalReturnReport} />
            <Stack.Screen name="FunctionList" component={FunctionList} />
            <Stack.Screen name="Rental" component={Rental} />
            <Stack.Screen name="RentalPage" component={RentalPage} />
            <Stack.Screen name="ExplainPage" component={ExplainPage} />
            <Stack.Screen name="DonationPage" component={DonationPage} />
            <Stack.Screen name="ReturnPage" component={ReturnPage} />
            <Stack.Screen name="ScanStation" component={ScanStation} />
            <Stack.Screen name="ReposrtList" component={ReposrtList} />
            <Stack.Screen name="SearchStation" component={SearchStation} />

            <Stack.Screen name='MapView' component={MapView}/>
          </Stack.Navigator>
        </NavigationContainer>

      </>

    );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    appLoading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });




/*
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, PermissionsAndroid, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { db } from '../project/firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
//import {PERMISSIONS, RESULTS, requestMultiple,checkMultiple,request} from 'react-native-permissions';
import base64 from 'react-native-base64';

const App = () => {
  const [manager, setManager] = useState(new BleManager());
  const [devices, setDevices] = useState([]); //Scan devices
  const [test, setTest] = useState();
  const [user, setUsers] = useState();


  useEffect(() => {
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') scanAndConnect();
    }, true);

    setManager(new BleManager());

  }, []);

  const dbTest = async () => {
    // firebase
    console.log("dbdbdbdb");
    try {
      const data = await getDocs(collection(db, "User"))
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
      console.log('users--------\n', user)
    } catch (error) {
      console.log(error)
    }
    return () => subscription.remove();
  }

  const rent = async () => {
    //우산번호와 일치하는 각도 가져오기

  }



  //scan
  const scanAndConnect = async () => {
    console.log('scanAndConnect')
    await manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("scanAndConnect error");
        return;
      }
      setDevices(prevDevices => {
        if (!prevDevices.some(d => d.id === device.id)) {
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };


  const connectToDevice = async device => {
    try {
      //connect
      const connectedDevice = await manager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Connected to', connectedDevice.name);

      //Read Massage from Connected Device
      connectedDevice.monitorCharacteristicForService(
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        (error, Characteristic) => {
          console.log('monitorCharacteristicForService: ' + base64.decode(`${Characteristic?.value}`));
        })
    } catch (error) {
      console.log('Connection/Read error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => connectToDevice(item)}>
      <Text>{item.name || 'Unknown Device'}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>

  );

  //send
  const send = async () => {
    try {
      console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSS')
      await manager.writeCharacteristicWithResponseForDevice(
        '4C:24:98:70:B0:B9',
        '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
        '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
        '7JWI64WV'
      )
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={() => scanAndConnect()}>
        <Text style={{ fontSize: 30, paddingTop: 30 }}>{"Click to Scan"} </Text>
      </TouchableOpacity>
      <Button
        onPress={send}
        title='보내기'
      />
      <Button
        onPress={dbTest}
        title='User'
      />
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default App;
*/