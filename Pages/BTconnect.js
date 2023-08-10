import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, PermissionsAndroid, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
//import {PERMISSIONS, RESULTS, requestMultiple,checkMultiple,request} from 'react-native-permissions';
import base64 from 'react-native-base64';

const BTconnect = () => {
    const [manager] = useState(new BleManager());
    const [devices, setDevices] = useState([]); //Scan devices
    const [user, setUsers] = useState();


    useEffect(() => {
        const subscription = manager.onStateChange(state => {
            if (state === 'PoweredOn') scanAndConnect();
        }, true);
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

export default BTconnect;