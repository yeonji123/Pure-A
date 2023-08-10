import React from 'react';
import { 
    View, Text, StyleSheet,
    Dimensions, Image, 
} from 'react-native';




const Detail = (props) => {
    return (
        <View 
            style={styles.detailView}
            
        >
            <View style={styles.detailText}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{props.title}</Text>
            </View>
            {
                props.icon == "false" ?
                    <View style={{ width: '40%', justifyContent: 'center', alignItems: 'center', }}>
                        {
                            props.value != null ?
                                <Text style={{ fontSize: 15, }}>{props.value}</Text>
                                : null
                        }
                    </View> :
                    <>
                        <View style={styles.value}>
                            {
                                props.value != null ?
                                    <Text style={{ fontSize: 15, }}>{props.value}</Text>
                                    : null
                            }
                        </View>
                        <View style={styles.iconView}>
                            {
                                props.icon == "true" ?
                                    <Image style={{ width: '100%', height: '100%' }} source={require('../assets/blue_arrow_icon.png')}></Image>
                                    : null
                            }

                        </View>
                    </>
            }
        </View>

    );
};

export default Detail;

const styles = StyleSheet.create({
    detailView: {
        flexDirection: 'row',
        padding: 10,
        width: Dimensions.get('window').width * 0.8,
        height: Dimensions.get('window').height * 0.08,
    },
    detailText: {
        width: '60%',
        justifyContent: 'center',
    },
    value: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconView: {
        width: '10%',
        height: '100%',
        padding: 5,
    },
});

