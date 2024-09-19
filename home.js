import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons, Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [incomeCategory, setIncomeCategory] = useState(0);
  const [totalBalance, setTotalBalance] = useState("");
  const [showIncomeInput, setShowIncomeInput] = useState(false);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [debts, setDebts] = useState(0);
  const [savings, setSavings] = useState(0);
  const [cardDetails, setCardDetails] = useState(0);
  const [expenseDetails, setExpenseDetails] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const scrollViewRef = useRef();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserDetails().then(() => setRefreshing(false));
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        "http://192.168.9.61:3000/getFinanceDetails"
      );
      const {
        USERNAME,
        CARD_DETAILS,
        TOTAL_BALANCE,
        SAVINGS,
        DEBTS,
        EXPENSES,
      } = response.data;

      console.log("User details fetched successfully");

      setTotalBalance(TOTAL_BALANCE);
      setSavings(SAVINGS);
      setDebts(DEBTS);
      setExpenseDetails(EXPENSES);
      setCardDetails(CARD_DETAILS);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const cards = [
    { amount: "₹17,452", style: styles.cardBlack, icon: "cc-mastercard" },
    { amount: "₹6,672", style: styles.cardWhite, icon: "cc-visa" },
  ];

  const renderCardItem = (item, index) => (
    <View key={index} style={[styles.card, item.style]}>
      <FontAwesome
        name={item.icon}
        size={24}
        color="white"
        style={styles.cardIcon}
      />
      <Text style={styles.cardAmount}>{item.amount}</Text>
      <Text style={styles.cardNumber}>**** 1234</Text>
    </View>
  );

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleAddIncome = async () => {
    if (incomeAmount && incomeCategory) {
      const newBalance =
        parseFloat(totalBalance.replace("₹", "").trim()) +
        parseFloat(incomeAmount);
      setTotalBalance(`${newBalance.toFixed(2)}`);
      setIncomeAmount("");
      setIncomeCategory("category");
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    setShowIncomeInput(!showIncomeInput);
    setShowExpenseInput(false);

    try {
      await axios.post("http://192.168.9.61:3000/updateTotalBalance", {
        TOTAL_BALANCE: parseInt(incomeAmount) + parseInt(totalBalance),
      });
      console.log("Total balance updated successfully");
    } catch (error) {
      console.error("Error updating total balance: ", error);
    }
  };

  const handleAddExpense = async () => {
    if (expenseAmount && expenseCategory) {
      const newBalance =
        parseFloat(totalBalance.replace("₹", "").trim()) -
        parseFloat(expenseAmount);
      if (newBalance < 0) {
        Alert.alert("Error", "Expense price cannot go more than total balance");
        return;
      }
      setTotalBalance(`${newBalance.toFixed(2)}`);
      setExpenseAmount("");
      setExpenseCategory("category");
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
    setShowExpenseInput(!showExpenseInput);
    setShowIncomeInput(false);

    try {
      await axios.post("http://192.168.9.61:3000/updateTotalBalance", {
        TOTAL_BALANCE: totalBalance - expenseAmount,
      });
      console.log("Total balance updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.balanceContainer}>
        <View>
          <Text style={styles.totalBalanceText}>Total balance</Text>
          <Text style={styles.balanceAmount}>₹{totalBalance} </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <View style={styles.settingsIconContainer}>
            <Feather name="settings" size={20} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardsTitle}>My cards</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.addCard}
          onPress={() => {
            fetchUserDetails();
          }}
        >
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
        >
          {cards.map((item, index) => renderCardItem(item, index))}
        </ScrollView>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.addButton, { marginRight: 10 }]}
          onPress={handleAddIncome}
        >
          <Text style={styles.buttonText}>
            <MaterialIcons name="attach-money" size={18} color="black" /> Add
            income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>
            <MaterialIcons name="money-off" size={18} color="black" /> Add
            expense
          </Text>
        </TouchableOpacity>
      </View>

      {showIncomeInput && (
        <View style={styles.incomeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#aaa"
            value={incomeAmount}
            onChangeText={setIncomeAmount}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={incomeCategory}
            onValueChange={(itemValue, itemIndex) =>
              setIncomeCategory(itemValue)
            }
          >
            <Picker.Item label="Salary" value="salary" />
            <Picker.Item label="Investments" value="investments" />
            <Picker.Item label="Gifts" value="gifts" />
            <Picker.Item label="Refunds" value="refunds" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddIncome}
          >
            <Text style={styles.textStyle}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {showExpenseInput && (
        <View style={styles.expenseInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#aaa"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={expenseCategory}
            onValueChange={(itemValue, itemIndex) =>
              setExpenseCategory(itemValue)
            }
          >
            <Picker.Item label="Entertainment" value="Entertainment" />
            <Picker.Item label="Shopping" value="shopping" />
            <Picker.Item label="Education" value="Education" />
            <Picker.Item label="Bills" value="bills" />
            <Picker.Item label="Health" value="Health" />
          </Picker>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddExpense}
          >
            <Text style={styles.textStyle}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBoxBlack}>
          <Text style={styles.summaryTitle}>₹{debts}</Text>
          <Text style={styles.summarySubtitle}>Debts</Text>
        </View>
        <View style={styles.summaryBoxBlack}>
          <Text style={styles.summaryTitle}>₹{savings}</Text>
          <Text style={styles.summarySubtitle}>Savings</Text>
        </View>
      </View>

      <View style={styles.controlFinanceContainer}>
        <Text style={styles.controlFinanceText}>Control your finances</Text>
        <TouchableOpacity
          style={styles.statisticsButton}
          onPress={() => {
            navigation.navigate("Statistics");
          }}
        >
          <Text style={styles.statisticsText}>Statistics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>
          {`${moment().format("MMMM")} Expenses`}
        </Text>
        <View style={styles.expensesIconsContainer}>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Feather name="coffee" size={24} color="black" />
            </View>
            <Text style={styles.expenseText}>₹{expenseDetails["ENT"]}</Text>
          </View>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Feather name="shopping-cart" size={24} color="black" />
            </View>
            <Text style={styles.expenseText}>₹{expenseDetails["SHP"]}</Text>
          </View>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Feather name="book" size={24} color="black" />
            </View>
            <Text style={styles.expenseText}>₹{expenseDetails["EDU"]}</Text>
          </View>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Feather name="home" size={24} color="black" />
            </View>
            <Text style={styles.expenseText}>₹{expenseDetails["BILS"]}</Text>
          </View>
          <View style={styles.expenseItem}>
            <View style={styles.expenseIconContainer}>
              <Feather name="heart" size={24} color="black" />
            </View>
            <Text style={styles.expenseText}>₹{expenseDetails["HLT"]}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  totalBalanceText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  settingsIconContainer: {
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 50,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  cardsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  addCard: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.2,
    marginRight: 10,
    height: 150,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    width: width * 0.55,
    height: 150,
    justifyContent: "center",
    alignItems: "flex-start",
    marginHorizontal: width * 0.02,
  },
  cardBlack: {
    backgroundColor: "#000",
  },
  cardWhite: {
    backgroundColor: "#E0E0E0",
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  cardNumber: {
    fontSize: 18,
    color: "#B0B0B0",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#F4F4F4",
    padding: 20,
    borderRadius: 15,
    width: "48%",
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryBoxBlack: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 15,
    width: "48%",
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  summarySubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  controlFinanceContainer: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlFinanceText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  statisticsButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
  },
  statisticsText: {
    fontSize: 14,
    color: "#000",
  },
  expensesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  expensesContainer: {
    marginBottom: 20,
    backgroundColor: "#F4F4F4",
    padding: 15,
    borderRadius: 15,
    paddingVertical: 20,
  },
  expensesIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseItem: {
    alignItems: "center",
  },
  expenseIconContainer: {
    backgroundColor: "#DBDBDB",
    padding: 10,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  textStyle: {
    color: "#fff",
  },

  input: {
    height: 40,
    marginVertical: 5,
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  incomeInputContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#F4F4F4",
    marginBottom: 20,
  },
  expenseInputContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#F4F4F4",
    marginBottom: 20,
  },
});

export default DashboardScreen;
