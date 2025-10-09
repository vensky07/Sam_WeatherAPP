import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const buttonSize = width / 4 - 15; // bouton adaptatif selon écran

export default function App() {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: number) => {
    if (waitingForSecondOperand) {
      setDisplay(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0,");
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes(",")) {
      setDisplay(display + ",");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleBackspace = () => {
    if (waitingForSecondOperand) return;
    setDisplay(display.length === 1 ? "0" : display.slice(0, -1));
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display.replace(",", "."));

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(inputValue);
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (secondOperand: number) => {
    if (firstOperand === null || operator === null) return secondOperand;

    switch (operator) {
      case "+":
        return firstOperand + secondOperand;
      case "-":
        return firstOperand - secondOperand;
      case "×":
        return firstOperand * secondOperand;
      case "÷":
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  };

  const handleEquals = () => {
    if (firstOperand === null || !operator) return;
    const result = performCalculation(parseFloat(display.replace(",", ".")));
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const renderButton = (
    label: string,
    onPress: () => void,
    style?: any,
    textStyle?: any
  ) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      {/* Buttons Grid */}
      <View style={styles.buttons}>
        {renderButton("C", clearDisplay, styles.btnClear, { color: "#E74C3C" })}
        {renderButton("%", () => handleOperator("%"), styles.btnOp)}
        {renderButton("⌫", handleBackspace, styles.btnOp)}
        {renderButton("÷", () => handleOperator("÷"), styles.btnOp)}

        {renderButton("7", () => inputDigit(7))}
        {renderButton("8", () => inputDigit(8))}
        {renderButton("9", () => inputDigit(9))}
        {renderButton("×", () => handleOperator("×"), styles.btnOp)}

        {renderButton("4", () => inputDigit(4))}
        {renderButton("5", () => inputDigit(5))}
        {renderButton("6", () => inputDigit(6))}
        {renderButton("-", () => handleOperator("-"), styles.btnOp)}

        {renderButton("1", () => inputDigit(1))}
        {renderButton("2", () => inputDigit(2))}
        {renderButton("3", () => inputDigit(3))}
        {renderButton("+", () => handleOperator("+"), styles.btnOp)}

        {renderButton("00", () => setDisplay(display + "00"))}
        {renderButton("0", () => inputDigit(0))}
        {renderButton(",", inputDecimal)}
        {renderButton("=", handleEquals, styles.btnEqual)}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // fond noir
  },
  display: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  displayText: {
    color: "white",
    fontSize: 64,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 20,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: "gray", // gris pour les chiffres
    justifyContent: "center",
    alignItems: "center",
    margin: 7,
  },
  buttonText: {
    fontSize: 28,
    color: "black", // texte noir sur fond gris/jaune
    fontWeight: "bold",
  },
  btnOp: {
    backgroundColor: "yellow", // opérateurs en jaune
  },
  btnClear: {
    backgroundColor: "yellow", // AC jaune
  },
  btnEqual: {
    backgroundColor: "yellow", // = jaune
  },
});
