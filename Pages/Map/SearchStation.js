import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';

import DonationComponent from '../../Component/DonationComponent';

// firebase 데이터 추가
import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TitleName from '../../Component/TitleName';

const MyDonation = ({ navigation }) => {
    const [id, setId] = useState();
    const [stationList, setStationList] = useState();
    const [searchText, setSearchText] = useState(''); // 검색어
    const [isSearch, setIsSearch] = useState(false); // 검색 버튼 눌렀는지 여부
    const [nostation, setNostation] = useState(false); // 검색 결과 없음
    var stationcount = 0

    useEffect(() => {
        // DB 읽어오기   
        (async () => {
            try {
                console.log('SearchStation.js')

                const data = await getDocs(collection(db, "Station")) // Station이라는 테이블 명
                const id = await AsyncStorage.getItem('id')
                setId(id)

                console.log(id)

                setStationList(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))) // map을 돌려서 데이터를 복사하여 붙여놓고, id를 추가해줌

            } catch (error) {
                console.log('eerror', error.message)
            }
        })();

    }, []);



    return (
        <View style={styles.container}>
            <View style={styles.titleView}>


                <TitleName title={"주소로 검색하기"} />

                <View style={{ width: '90%', height: '100%', marginTop: 5, }}>
                    <View style={{ width: '100%', height: 60, marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, }}>
                        <TextInput
                            style={{ width: '70%', height: 60, fontSize: 15, paddingLeft: 10, marginLeft: 5, borderRadius: 10, borderWidth: 1, borderColor: 'gray' }}
                            placeholder='검색어를 입력하세요.'
                            value={searchText}
                            onChangeText={(text) => {
                                setIsSearch(false) // 새로 입력했을 때 false
                                setSearchText(text)
                            }}
                        />

                        <TouchableOpacity
                            style={{ width: '25%', height: 60, backgroundColor: 'skyblue', justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}
                            onPress={() => {
                                setIsSearch(true) //검색하면 true
                                setNostation(true) // 검색 결과 없음
                                console.log('search')
                            }}
                        >
                            <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>검색</Text>
                        </TouchableOpacity>
                    </View>


                    <ScrollView>
                        <View style={{ padding: 10 }}>
                            {
                                stationList && stationList.map((item, index) => {

                                    var rentalCount = 0
                                    var returnCount = 0

                                    for (var i = 0; i < Object.keys(item.um_count_state).length; i++) { // um_count_state의 길이만큼 반복
                                        // key값이 string이라서 변환 후 state읽기
                                        if (item.um_count_state[String(i + 1)].state) { // true이면 대여 가능
                                            rentalCount++;
                                        } else {
                                            returnCount++;
                                        }
                                    }


                                    if (isSearch) { // 검색했을 때
                                        if (item.st_address.includes(searchText)) {
                                            stationcount++;
                                            console.log('검색 결과 있음', item.st_address)
                                            return (
                                                <View
                                                    key={index}
                                                    style={styles.stationView}
                                                >
                                                    <View style={[styles.stationInView, { justifyContent: 'flex-end' }]}>
                                                        <Text style={{ fontSize: 30, color: '#6699FF', fontWeight: 'bold' }}>{item.st_id}</Text>
                                                    </View>
                                                    <View style={styles.stationInView}>
                                                        <Text style={{ fontSize: 15, }}>{item.st_address}</Text>
                                                    </View>
                                                    <View style={[styles.stationInView, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>대여 가능 우산 갯수 : {rentalCount}</Text>
                                                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>반납 가능 우산 갯수 : {returnCount}</Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    }

                                    else { // 검색 안했을 때는 모든 station 보여주기

                                        return (
                                            <View
                                                key={index}
                                                style={styles.stationView}
                                            >
                                                <View style={[styles.stationInView, { justifyContent: 'flex-end' }]}>
                                                    <Text style={{ fontSize: 30, color: '#6699FF', fontWeight: 'bold' }}>{item.st_id}</Text>
                                                </View>
                                                <View style={styles.stationInView}>
                                                    <Text style={{ fontSize: 15, }}>{item.st_address}</Text>
                                                </View>
                                                <View style={[styles.stationInView, { alignItems: 'flex-end', justifyContent: 'center' }]}>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>대여 가능 우산 갯수 : {rentalCount}</Text>
                                                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>반납 가능 우산 갯수 : {returnCount}</Text>
                                                </View>
                                            </View>
                                        )
                                    }
                                })
                            }
                            {
                                isSearch && stationcount == 0 ?
                                    <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>검색 결과가 없습니다.</Text>
                                    </View>
                                    : null
                            }
                        </View>

                    </ScrollView>
                </View>

            </View>
        </View>
    );
};

export default MyDonation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingTop: 30,
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    stationView: {
        marginTop: 10,
        width: '100%',
        height: 150,
        backgroundColor: '#F2F2F2',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stationInView: {
        width: '90%',
        height: '30%',
        justifyContent: 'center',
    }
});