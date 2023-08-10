import { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity, Dimensions,
} from 'react-native';


const RentalPage = ({ navigation }) => {
    const [workcomplete, setWorkcomplete] = useState(false);

    const [dbCheck, setDBCheck] = useState(false); // db에 아두이노 state 계속 확인하기 ->  아두이노 에러 발생 가능하기 때문!




    useEffect(() => {

        // 데이터 요청
        console.log('RentalPage')
        // 로직
        // 1. 사용자가 rental에서 예를 누르면 이페이지로 이동
        // 2. 이페이지에서 블루투스를 이용하여 station 작동
        // 3. station 작동이 완료되면 대여 완료 버튼이 활성화
        // 4. 대여 완료 버튼을 누르면 functionList 페이지로 이동
        // 확인 부분은 블루투스

        // 작동하면서 아두이노 에러 발생할 수 있으니까 
        // station DB에서 station의 상태? 1초마다 계속 확인하는 코드 
        // -> 모터 동작했는데 우산이 없음
        // -> 대여 동작 완료했는데 대여 우산을 가져가지 않음


        
    }, []);



    // 아두이노 에러 : 대여 실패
    const rentalError = () => {
        var errorRental = 0 // 에러 코드를 반환해줄 값
        // 대여 에러
        if (errorRental == 102) {
            // 1. 모터에 대여 우산이 없음
            // 모터가 동작했는데 대여 우산이 없는 상태
            props.navigation.pop()
            Alert.alert('대여 실패', '대여 가능 우산이 없습니다 다시 버튼을 눌러주세요.', [{ text: '확인', onPress: () => console.log('OK Pressed') }], { cancelable: false })
        }
        else if (errorRental == 101) {
            // 2. 대여 동작이 완료되었으나, 대여 우산을 대여 하지 않음
            // 모터가 돌아가서 사용자가 가져가기 기다림
            props.navigation.pop()
            Alert.alert('대여 실패', '대여하기 위해 동작했으나 우산을 대여하셨는지 확인해주세요', [{ text: '확인', onPress: () => console.log('OK Pressed') }], { cancelable: false })

        } else if (errorRental == 100) {
            // 대여 성공

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
                    <Image style={{ width: '100%', height: '80%' }} source={require('../../assets/rentalImage.gif')}></Image>
                </View>
            </View>

            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={styles.buttonstyle}
                    onPress={() => navigation.navigate('Rental', { data: stationNum })}

                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>대여 완료</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RentalPage;


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
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.10,
        backgroundColor: '#6699FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }


})