import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, Modal, 
    TouchableOpacity, Dimensions, 
    ScrollView, Pressable, Alert,
} from 'react-native';

import TitleName from '../../Component/TitleName';

//fire store
//npx expo install firebase
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';


const Rental = (props) => {
    const [stationData, setStationData] = useState(); // Station 전체 데이터
    const [umbrellaData, setUmbrellaData] = useState([]); // Station에 있는 우산 데이터
    const [umNumber, setUmNumber] = useState(); // Station에 있는 우산 번호
    // 모달
    const [checkModal, setCheckModal] = useState(false); // 모달창



    useEffect(() => {
        // 데이터 요청
        // props로 받은 station 번호로 데이터 요청
        (async () => {
            try {
                console.log('props.route', props.route.params.data) //station의 정보를 props.route로 받음
                const umlist = new Array() // set할 우산 데이터 배열
                
                // scan한 station의 정보를 읽어서 map으로 돌리기 위해 변환함
                for (var i = 0; i < Object.keys(props.route.params.data.um_count_state).length; i++) { // um_count_state의 길이만큼 반복
                    
                    // json 형식으로 만들어서 key값도 바꿔서 만들고 (키 값이 숫자로 되어 있어서 string으로 바꿔줌)
                    // umbrellaData에 넣어줌
                    // Object type으로 값을 넣어줌
                    var umDataOj = new Object(); // 우산 데이터를 담을 Object

                    var key = "st_"+String(i+1) // key값 : st_1, st_2, ... 가 됨
                    
                    var value = new Object(); // 새로운 Object 생성
                    value['angle'] = props.route.params.data.um_count_state[String(i + 1)].angle
                    value['state'] = props.route.params.data.um_count_state[String(i + 1)].state
                    // {"action_check": false, "값" : value , ...} 이런 형식으로 만들어짐
                    // [{ " key " : [{ " angle " : 값 , " state " : 값 }], ... }]
                    
                    // Object type
                    umDataOj[key] = value
                    umlist.push(umDataOj) // umlist에 넣기
                    // console.log('umlist', umlist) // check
                }
                // 우산 데이터가 들어있는 배열을 set
                setUmbrellaData(umlist)

            } catch (error) {
                console.log('eerror', error.message)
            }
        })();
    }, []);


    return (
        <View style={styles.container}>
            <TitleName title='대여하기' />

            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={checkModal}
                    onRequestClose={() => {
                        setCheckModal(!checkModal);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalTop}>
                                <Text style={{ fontSize: 20, textAlign: 'center' }}>대여하기</Text>
                            </View>
                            <View style={styles.modalMid}>
                                {
                                    umNumber ?
                                        <>
                                            <Text style={{ fontSize: 25, }}>{umNumber} 번 우산을 </Text>
                                            <Text style={{ fontSize: 25, }}>대여하시겠습니까? </Text>
                                        </>
                                        : null
                                }
                            </View>
                            <View style={styles.modalbot}>
                                <Pressable
                                    style={{ width: '50%' }}
                                    onPress={() => {
                                        // station 유무 확인 함수
                                        
                                        console.log('station 작동')
                                        setCheckModal(!checkModal)
                                        props.navigation.navigate('RentalPage', { data: stationData })
                                    }}>
                                    <Text style={styles.textStyle}>확인</Text>
                                </Pressable>
                                <Pressable
                                    style={{ width: '50%' }}
                                    onPress={() => setCheckModal(!checkModal)}>
                                    <Text style={styles.textStyle}>취소</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

            </View>

            
            <ScrollView style={{ width: '100%', height: '100%', padding: 10 }}>
                {
                    umbrellaData?.map((row, idx) => {
                        // row 값 확인하기
                        // console.log('angle',row[`st_${idx+1}`].angle)
                        return (
                            <View 
                                style={{ padding: 5 }}
                                key={idx}
                            >
                                <TouchableOpacity
                                    key={idx}
                                    style={row[`st_${idx+1}`].state ? styles.buttonstyle : [styles.buttonstyle, { opacity: 0.3 }]} 
                                    // 우산이 있으면 버튼을 누를 수 있게 하고, 없으면 누를 수 없게 함
                                    onPress={() => {
                                        console.log('TouchableOpacity')
                                        setUmNumber(idx+1)
                                        setCheckModal(!checkModal)
                                    }}
                                    disabled={!row[`st_${idx+1}`].state}
                                >
                                    <Text key={idx} style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{idx + 1}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    );
};

export default Rental;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 20,
    },
    buttonView: {
        justifyContent: 'space-between',
        height: Dimensions.get('window').height * 0.1,
        marginBottom: 20,
    },
    buttonstyle: {
        width: '100%',
        height: Dimensions.get('window').height * 0.08,
        backgroundColor: '#C4C4C4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTop: {
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    modalMid: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    modalbot: {
        width: '100%',
        backgroundColor: '#B2CCFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderColor: 'gray',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    modalbutton: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        borderRadius: 10,
    },
    textStyle: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
});