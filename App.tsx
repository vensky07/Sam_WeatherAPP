import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  status?: "success" | "warning" | "error" | "neutral" | "info";
  showBadge?: boolean;
  badgeText?: string;
  percentage?: number | null;
};

const MetricCard = ({
  title,
  value,
  subtitle,
  status = "neutral",
  showBadge = false,
  badgeText = "",
  percentage = null,
}: MetricCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "#22C55E";
      case "warning":
        return "#EAB308";
      case "error":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusEmoji = () => {
    switch (status) {
      case "success":
        return "✔";
      case "warning":
        return "⚠";
      case "error":
        return "✖";
      case "info":
        return "ℹ";
      default:
        return "●";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, { borderColor: getStatusColor() }]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.cardIcon, { color: getStatusColor() }]}>
          {getStatusEmoji()}
        </Text>
      </View>

      <View style={styles.cardValueRow}>
        <Text style={[styles.cardValue, { color: getStatusColor() }]}>
          {value}
        </Text>
        {percentage !== null && (
          <Text style={styles.cardPercentage}>{percentage}%</Text>
        )}
      </View>

      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}

      {showBadge && badgeText && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: `${getStatusColor()}20`,
              borderColor: getStatusColor(),
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: getStatusColor() }]}>
            {badgeText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function App() {
  const { width } = useWindowDimensions();

  const metrics = [
    {
      title: "Security",
      value: "0",
      subtitle: "Open issues",
      status: "success",
      showBadge: true,
      badgeText: "A",
    },
    {
      title: "Reliability",
      value: "0",
      subtitle: "Open issues",
      status: "success",
      showBadge: true,
      badgeText: "A",
    },
    {
      title: "Maintainability",
      value: "1",
      subtitle: "Open issues",
      status: "success",
      showBadge: true,
      badgeText: "A",
    },
    {
      title: "Accepted issues",
      value: "0",
      subtitle: "Valid issues that were not fixed",
      status: "neutral",
    },
    {
      title: "Coverage",
      value: "97.1",
      subtitle: "On 552 lines to cover",
      status: "success",
    },
    {
      title: "Duplications",
      value: "0.0",
      subtitle: "On 27 lines",
      status: "success",
    },
  ];

  const numCols = width > 600 ? 2 : 1;
  const padding = 20 * 2;
  const spacing = 16 * (numCols - 1);
  const cardWidth = (width - padding - spacing) / numCols;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircleOuter}>
            <View style={styles.logoCircleInner}>
              <Text style={styles.logoLetter}>S</Text>
            </View>
          </View>
          <Text style={styles.logoText}>Sonar</Text>
        </View>
      </View>

      <View style={styles.projectOverviewWrapper}>
        <View style={styles.projectOverview}>
          <Text style={styles.projectOverviewTitle}>Project Overview</Text>
          <Text style={styles.projectOverviewText}>
            A high-level summary of project quality and performance indicators.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitleText}>
          Resulting in more secure, reliable, and maintainable software
        </Text>

        <View
          style={[
            styles.grid,
            {
              flexDirection: numCols === 1 ? "column" : "row",
              flexWrap: "wrap",
            },
          ]}
        >
          {metrics.map((metric, index) => (
            <View key={index} style={[styles.cardWrapper, { width: cardWidth }]}>
              <MetricCard {...(metric as MetricCardProps)} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#3B0764",
  },
  header: {
    backgroundColor: "#3B0764",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: "flex-start",
    borderBottomColor: "#5B21B6",
    borderBottomWidth: 0.5,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircleOuter: {
    width: 48,
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircleInner: {
    width: 28,
    height: 28,
    backgroundColor: "#9333EA",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
  },
  projectOverviewWrapper: {
    backgroundColor: "#3B0764",
    padding: 5,
    alignItems: "center",
  },
  projectOverview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 50,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  projectOverviewTitle: {
    color: "#4C1D95",
    fontSize: 20,
    fontWeight: "700",
  },
  projectOverviewText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: "#3B0764",
  },
  scrollContainer: {
    padding: 20,
  },
  subtitleText: {
    color: "#E9D5FF",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  cardIcon: {
    fontSize: 18,
  },
  cardValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  cardPercentage: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 12,
  },
});
