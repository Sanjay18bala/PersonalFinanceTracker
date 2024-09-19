import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { MaterialIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const StatisticsScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Week");
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  const data = {
    Day: [120, 180, 150, 310, 270, 520, 430],
    Week: [1100, 1950, 1700, 2900, 2600, 3300, 2800],
    Month: [4800, 19800, 14800, 12800, 24300, 19500, 34200],
    Year: [59000, 71500, 65500, 92500, 87500, 113000, 101500],
  };

  useEffect(() => {
    setChartData(data[selectedTab]);
  }, [selectedTab]);

  const categories = [
    "All",
    "Entertainment",
    "Food",
    "Education",
    "Bills",
    "Health",
  ];

  const transactions = [
    { id: 1, category: "Entertainment", date: "24 Oct", amount: "-250" },
    { id: 2, category: "Food", date: "23 Oct", amount: "-380" },
    { id: 3, category: "Education", date: "20 Oct", amount: "+2500" },
    { id: 4, category: "Bills", date: "19 Oct", amount: "-120" },
    { id: 5, category: "Health", date: "18 Oct", amount: "-150" },
    { id: 6, category: "Entertainment", date: "17 Oct", amount: "-180" },
    { id: 7, category: "Food", date: "16 Oct", amount: "-200" },
    { id: 8, category: "Education", date: "15 Oct", amount: "+3000" },
    { id: 9, category: "Bills", date: "14 Oct", amount: "-100" },
    { id: 10, category: "Health", date: "13 Oct", amount: "-130" },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedCategory === "All" && selectedDate === "All") return true;
    if (selectedCategory !== "All" && selectedDate === "All")
      return transaction.category === selectedCategory;
    if (selectedCategory === "All" && selectedDate !== "All")
      return transaction.date === selectedDate;
    return (
      transaction.category === selectedCategory &&
      transaction.date === selectedDate
    );
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      <View style={styles.balanceContainer}>
        <View>
          <Text style={styles.totalBalanceText}>Total balance</Text>
          <Text style={styles.balanceAmount}>$24,124</Text>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        {["Day", "Week", "Month", "Year"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.cardsContainer}>
        <View style={[styles.card, styles.cardBlack]}>
          <Text style={styles.cardAmountBlack}>$2,258</Text>
          <Text style={styles.cardSubtitleBlack}>Expenses</Text>
        </View>
        <View style={[styles.card, styles.cardWhite]}>
          <Text style={styles.cardAmountWhite}>$5,900</Text>
          <Text style={styles.cardSubtitleWhite}>Incomes</Text>
        </View>
      </View>

      <View style={styles.graphContainer}>
        <BarChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: chartData,
              },
            ],
          }}
          width={width - 40}
          height={220}
          yAxisSuffix="k"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => "#007bff",
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {},
            barPercentage: 0.5,
            propsForBackgroundLines: {
              stroke: "#e3e3e3",
            },
          }}
          style={{
            marginVertical: 8,
          }}
        />
      </View>

      <Text style={styles.transactionsTitle}>Transactions</Text>
      <View style={styles.transactionsFilterContainer}>
        <ScrollView
          horizontal
          style={{ flexDirection: "row" }}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.activeFilter,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <View style={styles.filterIconContainer}>
                {category === "Entertainment"}
                {category === "Food"}
                {category === "Education"}
                {category === "Bills"}
                {category === "Health"}
              </View>
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && { color: "white" },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView
        style={styles.transactionsContainer}
        showsHorizontalScrollIndicator={false}
      >
        {filteredTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionIconContainer}>
              {transaction.category === "Entertainment" && (
                <Feather name="coffee" size={24} color="black" />
              )}
              {transaction.category === "Food" && (
                <Feather name="shopping-cart" size={24} color="black" />
              )}
              {transaction.category === "Education" && (
                <Feather name="book" size={24} color="black" />
              )}
              {transaction.category === "Bills" && (
                <Feather name="home" size={24} color="black" />
              )}
              {transaction.category === "Health" && (
                <Feather name="heart" size={24} color="black" />
              )}
            </View>
            <View style={styles.transactionTextContainer}>
              <Text style={styles.transactionTitle}>
                {transaction.category}
              </Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>{transaction.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  totalBalanceText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007bff",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#fff",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: "left",
  },
  cardBlack: {
    backgroundColor: "#131313",
    marginRight: 10,
  },
  cardWhite: {
    backgroundColor: "#FFF",
    marginLeft: 10,
    borderColor: "#e3e3e3",
    borderWidth: 1,
  },
  cardAmountBlack: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  cardAmountWhite: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitleBlack: {
    fontSize: 16,
    color: "#FFF",
  },
  cardSubtitleWhite: {
    fontSize: 16,
    color: "#000",
  },
  graphContainer: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    backgroundColor: "#fff",
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  transactionsFilterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  transactionsContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  transactionTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  transactionTitle: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  filterButton: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#f5f5f5",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#000",
  },
  filterIconContainer: {
    marginRight: 5,
  },
  transactionIconContainer: {
    marginRight: 10,
  },
});

export default StatisticsScreen;
