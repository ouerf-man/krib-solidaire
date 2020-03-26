import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native"
import { Button } from "react-native-elements"
import Background from '../shared/Background'
import { db, getInstanceId } from "./firebase/init"
class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [{
                phone: "",
                adress: "",
                date: "",
                order: []
            }],
            keys: [],
            errorMessage: '',
        };
    }

    componentDidMount() {
        this.readData();
    }

    componentDidUpdate(){
        this.readData();
    }

    async handleDelete(index) {
        // Get the users ID
        const uid = getInstanceId();

        let userRef = db.ref(`orders/${uid}/${this.state.keys[index].toString()}`);
        try {
            await userRef.remove()
        } catch (e) {
            this.setState({ errorMessage: this.state.keys[index] })
        }
    }

    async readData() {

        // Get the users ID
        const uid = getInstanceId();

        // Create a reference
        const ref = db.ref(`orders/${uid}`);

        // Fetch the data snapshot
        try {
            await ref.on("value", (snapshot) => {
                const val = snapshot.val()
                if (val) {
                    let result = Object.keys(val).map((key, index) => {
                        return val[key];
                    });
                    let keys = Object.keys(val);
                    this.setState({ orders: result, keys: keys })
                }
            });



        } catch (e) {
            this.setState({ errorMessage: 'problème de connexion...' })
            return;
        }


    }

    render() {

        const renderReturnItem = ({ item, index }) => {
            return (
                <View>
                    <View style={
                        styles.orders
                    }>
                        <View>
                            <Text
                                style={styles.date}
                            >
                                {item.date}
                            </Text>
                        </View>
                        <View>
                            {item.order ? item.order.map((order, index1) => {
                                return (
                                    <Text key={index1} style={styles.order}>
                                        {order}
                                    </Text>
                                )
                            })
                                : <View></View>
                            }
                        </View>
                    </View>
                    {item.order.length >= 1 && <Button title="حذف" buttonStyle={styles.delete} onPress={() => this.handleDelete(index)} />}
                </View>
            )
        }
        return (
            <View>
                {
                    this.state.errorMessage === "" ? <FlatList
                        data={this.state.orders}
                        renderItem={renderReturnItem}
                        keyExtractor={item => item.phone.toString()}
                    /> : <Button title={this.state.errorMessage} containerStyle={{ display: "flex", alignItems: 'center' }} buttonStyle={styles.error} />
                }
            </View>

        )
    }
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
    orders: {
        borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
        width: width,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25
    },
    date: {
        fontSize: 8,
        marginRight: 5
    },
    order: {
        fontSize: 15
    },
    delete: {
        backgroundColor: 'red',
        width: 70,
        height: 30
    },
    error: {
        width: width * .6,
        marginTop: 55,
        backgroundColor: 'red'
    }
})

export default Orders;

