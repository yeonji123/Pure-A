import { useState, useEffect } from 'react';
import { View, Image } from 'react-native';

// 블루투스
import base64 from 'react-native-base64';
import { BleManager } from 'react-native-ble-plx';

const Loading = (props) => {
    const [stationData, setStationData] = useState(props.route.params.data); // Station 전체 데이터


    //블루투스
    const [manager] = useState(new BleManager());
    const [devices, setDevices] = useState([]); //Scan devices
    const [connect, setConnect] = useState(false) // 블루투스와 기기 연결 완료 되면 true로 바뀜
    const [timeout, setTimeout] = useState(false) // 10초 뒤에 블루투스 연동 가능한 기기 목록 그만 가져오기

    // 블루투스 
    useEffect(() => {
        const subscription = manager.onStateChange(state => {
            if (state === 'PoweredOn') scanAndConnect();
        }, true);

        setTimeout(() => {
            setTimeout(true)
            // 시간이 지나면 navigation으로 FunctionList로 이동 대여/반납/기부 버튼
            props.naviagtions.navigate('FunctionList', { data: stationData })
        },3000)

    }, []);


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

                    // device가 올때마다 mac 주소와 동일한지 확인함
                    connectToDevice(stationData.st_mac)

                    return [...prevDevices, device];
                }
                return prevDevices;
            });
        });



        setTimeout(() => {
            manager.stopDeviceScan(); // 10초 뒤에 블루투스 연동 가능한 기기 목록 그만 가져오기
        }, 10000);
    };


    const connectToDevice = async device => { // mac주소 가져옴
        try {
            //connect
            const connectedDevice = await manager.connectToDevice(device); //  mac 주소로 연결 
            await connectedDevice.discoverAllServicesAndCharacteristics(); // 모든 서비스와 특성을 찾음
            console.log('Connected to', connectedDevice.name); // 연결된 기기 이름

            //Read Massage from Connected Device
            connectedDevice.monitorCharacteristicForService(
                '0000ffe0-0000-1000-8000-00805f9b34fb', //serviceUUID
                '0000ffe1-0000-1000-8000-00805f9b34fb', //characterUUID
                (error, Characteristic) => {
                    console.log('monitorCharacteristicForService: ' + base64.decode(`${Characteristic?.value}`));
                })

            // 블루투스 연결 완료
            setConnect(true)
        } catch (error) {
            console.log('Connection/Read error:', error);
        }
    };



    return (
        <>
            {
                // 블루투스 연동 확인 3초 이상 걸리면 timeout, connect되면 다음 페이지로 이동
                timeout && connect ? (
                    <>
                        <Image
                            style={{ width: 100, height: 100, resizeMode: 'contain', }}
                            source={require('../assets/Loading.gif')}
                        />
                        <Text>Station과 연결 중입니다...</Text>
                    </>
                ) :
                    null
            }

        </>

    );
};

export default Loading;