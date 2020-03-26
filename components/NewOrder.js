import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, Dimensions, KeyboardAvoidingView } from "react-native"
import { Input, Icon, Button, Image } from "react-native-elements"
import Background from "../shared/Background"
import { THEME } from "./theme"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { db, getInstanceId } from './firebase/init';


function zeroFill(num) {
    return (num < 10 ? '0' : '') + num;
}

function getDateString() {
    const date = new Date();

    return date.getFullYear() + '-' +
        zeroFill(date.getMonth() + 1) + '-' +
        zeroFill(date.getDate());
}

class NewOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            name: "",
            adress: "",
            phone: "",
            order: "",
            errorMessage: "",
            loading: false,
        };
        this.secondTextInput = {}
        this.thirdTextInput = {}
        this.forthTextInput = {}
    }

    fieldIsEmpty(name, adresse, phone, orders) {
        if (name.trim() === "" || adresse.trim() === "" || phone.trim() === "" || orders.length==0) return true
    }

    sendData() {
        const date = new Date();
        const userId = getInstanceId();
        const orderId = Date.now() + userId.toString();
        const dateString = getDateString();
        const name = this.state.name;
        const adress = this.state.adress;
        const phone = this.state.phone;
        const order = this.state.orders;
        console.log(date.toString())
        if (this.fieldIsEmpty(name, adress, phone, order)) {
            this.setState({ errorMessage: "الرجاء ملأ جميع الخانات" });
            return;
        }
        try {
            if (userId) {
                db.ref(`orders/${userId}/${orderId}`).set({
                    name: name,
                    adress: adress,
                    phone: phone,
                    order: order,
                    date: date.toString()
                })
                    .then(() => {
                        this.setState({
                            orders: [],
                            name: "",
                            adress: "",
                            phone: "",
                            order: "",
                            errorMessage: "",
                            loading: false,
                        })
                    })
                    .catch(e => { throw new Error(e); this.setState({errorMessage:"problème de connexion..."}) })
                this.setState({ loading: true })
            }
        } catch (e) {

            this.setState({ errorMessage: 'Sorry, this order couldn\'t be saved :' + e.message });
        }

    }

    render() {
        const { orders, name, adress, phone, order } = this.state
        return (
            <ScrollView
                style={styles.wrapper}
            >
                <KeyboardAvoidingView>
                    <Input
                        inputStyle={styles.input}
                        labelStyle={styles.labelInput}
                        placeholder='الاسم'
                        label="الاسم"
                        returnKeyType="next"
                        autoFocus
                        value={name}
                        onChangeText={(text) => this.setState({ name: text })}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.secondTextInput = input; }}
                        inputStyle={styles.input}
                        labelStyle={styles.labelInput}
                        placeholder='حي عبد ربه , نهج حسن عبد ربّه.. المنزل عدد 666'
                        label="العنوان"
                        returnKeyType="next"
                        value={adress}
                        onChangeText={(text) => this.setState({ adress: text })}
                        onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.thirdTextInput = input; }}
                        labelStyle={styles.labelInput}
                        inputStyle={styles.input}
                        placeholder='54 469 350'
                        label="الهاتف"
                        keyboardType="number-pad"
                        returnKeyType="next"
                        value={phone}
                        onChangeText={(text) => this.setState({ phone: text })}
                        onSubmitEditing={() => { this.forthTextInput.focus(); }}
                        blurOnSubmit={false}
                    />
                    <Input
                        ref={(input) => { this.forthTextInput = input; }}
                        labelStyle={styles.labelInput}
                        inputStyle={styles.input}
                        placeholder='كيلو سميد'
                        label="الطلبات"
                        value={order}
                        returnKeyType="done"
                        onChangeText={(text) => this.setState({ order: text })}
                        leftIcon={() => {
                            return (
                                <TouchableOpacity style={styles.icon} onPress={
                                    () => {
                                        if (order.trim() !== "") {
                                            this.setState((prevState) => { return prevState.orders.push(order) });
                                            this.setState((prevState) => { return prevState.order = "" })
                                        }
                                    }
                                }>
                                    <Image source={require('./images/plus.png')} 
                                        style={{width:40,height:40}}
                                    />
                                </TouchableOpacity>
                            )
                        }}

                    />
                </KeyboardAvoidingView>
                <View style={styles.orders}>
                    {orders ? orders.map((item, index) => <Text key={index} style={styles.text}>{item}</Text>) : <View></View>}
                </View>
                <View style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        title="ابعث"
                        buttonStyle={styles.button1}
                        titleStyle={styles.textButton1}
                        onPress={() => {
                            this.sendData()
                        }}
                        loading={this.state.loading}
                    />
                    {
                        this.state.errorMessage==="" ? <View></View> : <Button  title={this.state.errorMessage} buttonStyle={styles.error} />
                    }
                </View>

            </ScrollView >
        );
    }
}

export default NewOrder;
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    input: {
        textAlign: "right"
    },
    labelInput: {
        marginTop: 30,
        textAlign: "right"
    },
    wrapper: {
        padding: 10
    },
    orders: {
        padding: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#DCDCDC",
        paddingBottom: 20
    },
    text: {
        fontSize: 18,
        marginBottom: 5
    },
    button1: {
        backgroundColor: THEME.backgroundColor1,
        width: width * 0.75,
        marginTop: 25,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FEFEFE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textButton1: {
        fontSize: 24,
        color: THEME.Color2,
        fontWeight: "bold"
    },
    icon: {
        width: 50,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    error: {
        width: width * .6,
        marginTop: 55,
        backgroundColor:'red'
    }
})