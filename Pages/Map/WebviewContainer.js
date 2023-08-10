import { WebView } from "react-native-webview";

const WebviewContainer = ({ handleSetRef, handleEndLoading }) => {
  const url = "http://10.20.36.84:19000";

  /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
  const handleOnMessage = ({ nativeEvent: { data } }) => {
    // data에 웹뷰에서 보낸 값이 들어옵니다.
    console.log(data);
  };

  return (
    <WebView
      onLoadEnd={handleEndLoading}
      onMessage={handleOnMessage}
      ref={handleSetRef}
      source={{ uri }}
    />
  );
};

export default WebviewContainer;