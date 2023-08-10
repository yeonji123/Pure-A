import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, Dimensions,
    Alert, Image
} from 'react-native';

//fire store
//npx expo install firebase
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';


const ReturnPage = (props) => {
    const [workcomplete, setWorkcomplete] = useState(false);

    useEffect(() => {
        // 데이터 요청
        (async () => {
            try {
                const data = await getDocs(collection(db, "Station"))
                data.docs.map((doc, idx) => {
                    let checkum = false
                    console.log('props', props.route.params.data)
                    if (doc.data().st_id == props.route.params.data.st_id) {
                        // 반납가능 여부 확인하기
                        // station에 있는 우산의 state가 true이면 우산 있음, false면 우산 없음
                        for (var i = 0; i < Object.keys(props.route.params.data.um_count_state).length; i++) { // um_count_state의 길이만큼 반복
                            console.log(props.route.params.data.um_count_state[String(i + 1)].state)
                            if (!props.route.params.data.um_count_state[String(i + 1)].state) { // 우산 반납 가능 value = state가 false
                                checkum = true // 우산 반납 가능함!
                                break;
                            }
                        }
                        console.log('checkum', checkum) // true이면 반납가능
                        if (!checkum) {
                            Alert.alert('반납 오류',
                                '다른 station을 사용해주세요',
                                [
                                    {
                                        text: "확인",
                                        onPress: () => navigation.navigate('Main')
                                    }
                                ]
                            )
                        }
                    }
                })


            } catch (error) {
                console.log('eerror', error.message)
            }
        })();


    }, []);



    useEffect(() => {

        // 데이터 요청
        console.log('ReturnPage.js')
        // 로직
        // 1. 사용자가 반납하기를 누르면 이 페이지로 이동
        // 2. 이 페이지에서 블루투스를 이용하여 station 작동
        // 3. station 작동이 완료되면 대여 완료 버튼이 활성화
        // 4. 반납 완료 버튼을 누르면 functionList 페이지로 이동

        // 작동하면서 아두이노 에러 발생할 수 있으니까 
        // station DB에서 station의 상태? 1초마다 계속 확인하는 코드 
        // -> 모터에 반납 우산이 이미 있음
        // -> 반납 동작이 완료되었으나, 


        
    }, []);




    // 아두이노 에러 : 반납 실패
    const rentalError = (errorRental) => {
        var errorRental = 0 // 에러 코드를 반환해줄 값
        // 반납 에러
        if (errorRental == 102) {
            // 1. 모터에 반납 우산이 이미 있음
            props.navigation.pop()
            Alert.alert('반납 실패', '반납 우산이 있습니다. 다시 반납하기 버튼을 클릭해주세요', [{ text: '확인', onPress: () => console.log('OK Pressed') }], { cancelable: false })
        }
        else if (errorRental == 101) {
            // 2. 반납 동작이 완료되었으나, 반납 우산을 반납 하지 않음
            // 모터가 돌아가서 사용자가 가져가기 기다림,
            props.naviagtion.pop()
            Alert.alert('반납 실패', '반납하신 우산을 확인할 수 없습니다. 다시 반납하기 버튼을 클릭해주세요', [{ text: '확인', onPress: () => console.log('OK Pressed') }], { cancelable: false })

        } else if (errorRental == 100) {
            // 반납 성공

        }

    }


    return (
        <View style={styles.container}>

            <View style={styles.explainView}>
                <Text style={styles.text}>Station</Text>
                <Text style={styles.text}>작동 중입니다....</Text>
            </View>


            <View style={{ padding: 10 }}>
                <View style={styles.pictureView}>
                    
                    <Image style={{width:'100%', height:'80%',}} source={require('../../assets/returnImage.gif')} />
                </View>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => props.navigation.navigate('FunctionList')}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납 완료</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => props.navigation.navigate('FunctionList')}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>반납 완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReturnPage;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',

    },
    explainView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        padding: 10,
    },
    pictureView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    buttonView: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 40,
        padding: 10,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    buttonstyle: {
        width: '43%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },


})