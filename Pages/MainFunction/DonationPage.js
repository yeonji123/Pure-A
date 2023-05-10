import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, Pressable, 
    Image, Button, Alert } from 'react-native';


// npm i expo-location
import { Camera, Constants } from 'expo-camera';
//fire store
//npx expo install firebase
import { db } from '../../firebaseConfig';
import { addDoc, getDocs, collection, setDoc, doc } from 'firebase/firestore';
// firestorage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
//loading
import Loading from '../../Component/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';




const DonationPage = ({ navigation, route }) => {
    // 사진 찍음 여부 확인 -> 사진 찍으면 true(=station 작동 disabled는 true)
    const [isphoto, setIsphoto] = useState(false); 
    const [stationID, setStationID] = useState(); // Station ID 데이터
    // 사진찍기
    const [hasCameraPermission, setHasCameraPermission] = useState(null); // 카메라 허용
    const [camera, setCamera] = useState(null); // 허용됨?
    const [image, setImage] = useState(null); // local 경로로된 사진
    const [photoModal, setPhotoModal] = useState(false); // 사진 찍기 모달
    const [type, setType] = useState(Camera.Constants.Type.back); // 전면, 후면 type
    // 사진 찍은거 DB에 저장
    const [firebaseImage, setFirebaseImage] = useState(null); // DB에 저장된 사진 링크
    // 로딩 여부
    const [loading, setLoading] = useState(false);
    // 기부 내역
    const [donationData, setDonationData] = useState(); // 전체 기부 내역 데이터
    const [number, setNumber] = useState(); // 기부 우산 번호






    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // 로딩창 보여주기 DB에 넣고 사진을 DB에 저장하고 로딩창 보여주기
    useEffect(() => {
        let timer = setTimeout(() => { setLoading(false) }, 3000);
        return () => { clearTimeout(timer) }
    }, [loading])


    useEffect(() => {
        // 데이터 요청
        (async () => {
            try {
                console.log('Donation Page params', route.params.stationdata)
                // 기부한 내용을 확인해야함

                // DB에 있는 Donation 데이터 가져오기
                const data = await getDocs(collection(db, "Donation"));
                setDonationData(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
            
                // 사용할 station의 id
                setStationID(route.params.stationdata.st_id)
                // 카메라 허용 받기
                const cameraStatus = await Camera.requestCameraPermissionsAsync();
                setHasCameraPermission(cameraStatus.status === 'granted');

            } catch (error) {
                console.log('eerror', error.message)
            }
        })();


    }, []);



    const takePicture = async () => {
        if (camera) {
            console.log('takePicture')

            // 로딩 보여주기
            setLoading(!loading)
            
            const data = await camera.takePictureAsync(null)
            setImage(data.uri); // 이미지 set
            console.log('data', data.uri);

            // 모달 닫기
            setPhotoModal(!photoModal)
            // storage에 올리기
            uploadImage(data.uri);
        }
    }


    
    
    // storage에 올리기 DB 설계
    const uploadImage = async (uri) => {
        console.log('result.uri------> ', uri)
        
        const storage = getStorage(); // firebase storage 가져오기
        const id = await AsyncStorage.getItem('id'); // 디바이스에 저장된 id 가져오기
        // DB에 저장되어 있는 데이터 값 확인하기

        // return 해서 number에 저장
        const number = checkimageURL() 

        // 링크 명 설정 : 사용자 ID_기부할 station의 ID_기부번호
        var imageid = `images/${id}_${stationID}_${number}.jpg`
        const storageRef = ref(storage, imageid); // storage에 저장할 위치 지정 (이미지 이름)

        const responce = await fetch(uri); // file 형태나 blob 형태로 가져올 수 있음
        const blob = await responce.blob(); // blob 형태로 가져오기
        

        const response = await uploadBytes(storageRef, blob, {
            contentType: 'image/jpeg',
        }); // storage에 저장하기, content type은 이미지 형식으로 지정
        
        const imageset = await getDownloadURL(storageRef) // storage에 저장된 이미지의 url 가져오기
        setFirebaseImage(imageset) // DB에 저장하기 위해 state에 저장
        setIsphoto(true) // 사진 찍음 여부 확인 
        console.log('firebase upload image', imageset)
        
        // station 작동하기
        // 작동 후 우산이 들어가면 ? 로직 다시 짜기 !!!!!!!!!!!
    }
    
    // 입력한 이미지 URL 
    const checkimageURL = () => {
        var dbnum = 0 // DB에서 기부 횟수가 몇번째인지 확인하는 방법
        const id = AsyncStorage.getItem('id') 

        // DB에서 확인함
        donationData.map((item) => {
            console.log(item.id)
            if (item.id.includes(id)) { // 사용자가 기부한 내역 확인
                dbnum = item.id.split('_')[1] // 마지막에 기부한 번호 확인
                console.log('dbnum', dbnum)
                setNumber(dbnum + 1) // 다음 기부 번호( +1 )
            }
        })

        if(dbnum==0){ // 기부한 적이 없다면 1로 설정
            console.log('첫 기부입니다')
            console.log(dbnum)
            setNumber(dbnum + 1) 
        }
        return dbnum+1
    }



    // DB에 저장하기
    const updateDB = async (imageid) =>{
        try{

            let todayData = new Date(); 
            let today = todayData.toLocaleDateString()

            const docRef = await setDoc(doc(db, "Donation", imageid), {
                d_date : today,
                d_image: firebaseImage,
                // d_num:
                st_id : stationID,
                u_id : await AsyncStorage.getItem('id'),
            });
            console.log("Document written with ID: ", docRef.id);
            Alert.alert('기부가 완료되었습니다')

            // DB에 저장 되면 대여/반납/기부 페이지로 이동
            navigation.navigate('FunctionList') 

        }
        catch(error){
            console.log('updateDB error', error.message)
        }
    }





    return (
        <View style={styles.container}>
            {
                loading ?
                    <Loading /> :
                    <>
                        <View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={photoModal}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setPhotoModal(!photoModal);
                                }}>

                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Camera
                                            ref={ref => setCamera(ref)}
                                            style={{
                                                height: 400,
                                                width: 300,
                                            }}
                                            // style={styles.fixedRatio}
                                            type={type}
                                        />

                                        <View style={{ width: 300, paddingTop: 10 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                                <Pressable
                                                    style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', }}
                                                    onPress={() => {
                                                        setType(
                                                            type === Camera.Constants.Type.back
                                                                ? Camera.Constants.Type.front
                                                                : Camera.Constants.Type.back
                                                        )
                                                    }} >
                                                    <View style={{
                                                        borderColor: "white",
                                                        justifyContent: 'center',
                                                        width: 40,
                                                        height: 40,
                                                        padding: 5,
                                                    }} >
                                                        <Image style={{ resizeMode: "cover", width: '100%', height: '100%', }}
                                                            source={require('../../assets/ch.png')}></Image>
                                                    </View>
                                                </Pressable>

                                                <Pressable
                                                    onPress={() => {
                                                        console.log("찰칵")
                                                        takePicture()
                                                    }} >
                                                    <View style={styles.takeButton}></View>
                                                </Pressable>
                                                <Pressable
                                                    style={{ width: 50, textAlign: 'center', justifyContent: 'center' }}
                                                    onPress={() => setPhotoModal(!photoModal)}
                                                >
                                                    <Text style={{ fontSize: 18, color: '#6699FF' }}>취소</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                        </View>







                        <View style={styles.explainView}>
                            <Text style={styles.text}>안쓰는</Text>
                            <Text style={styles.text}>우산 기부하기</Text>
                        </View>


                        <View style={{ padding: 10 }}>
                            <View style={styles.pictureView}>

                            </View>
                        </View>

                        <View style={styles.buttonView}>
                            {
                                isphoto ?
                                    <TouchableOpacity
                                        style={styles.buttonstyle}
                                        onPress={() => {
                                            console.log('기부 완료!')
                                            Alert.alert(
                                                '기부가 완료 되었습니다. 확인을 클릭하시면 기부가 완료됩니다.',
                                                [
                                                    {
                                                        text: "확인",
                                                        onPress: () => {
                                                            updateDB(firebaseImage)
                                                            navigation.navigate('FunctionList', { data: route.params.stationdata })
                                                        }
                                                    }
                                                ]
                                            )
                                            
                                        }}

                                    >
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>기부 완료</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={styles.buttonstyle}
                                        onPress={() => setPhotoModal(!photoModal)}
                                    >
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>사진 찍기</Text>
                                    </TouchableOpacity>
                            }

                        </View>
                    </>
            }
        </View>
    );
};

export default DonationPage;


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
        backgroundColor: 'gray',
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        width: '80%',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    takeButton: {
        borderColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        backgroundColor: "#5775D9",
        borderRadius: 100
    },
})