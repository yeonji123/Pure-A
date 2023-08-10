import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRef } from 'react';
import { WebviewContainer } from './WebviewContainer';

const MapView = () => {
    // 웹뷰와 rn과의 소통은 아래의 ref 값을 이용하여 이루어집니다.
    let webviewRef = useRef();

    /** 웹뷰 ref */
    const handleSetRef = _ref => {
        webviewRef = _ref;


        /** webview 로딩 완료시 */
        const handleEndLoading = e => {
            console.log("handleEndLoading");
            /** rn에서 웹뷰로 정보를 보내는 메소드 */
            webviewRef.postMessage("로딩 완료시 webview로 정보를 보내는 곳");
        };
        return (
            <View style={styles.container}>
                <WebviewContainer
                    webviewRef={webviewRef}
                    handleSetRef={handleSetRef}
                    handleEndLoading={handleEndLoading}
                />
            </View>
        )
    }
}
export default MapView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})