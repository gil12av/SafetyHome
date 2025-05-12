import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import {
  fetchScanHistory,
  deleteDevice,
  updateDevice,
  createDevice,
} from "../services/api";

const { width } = Dimensions.get("window");

type Device = {
  _id: string;
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  vendor?: string;
  version?: string;
  scanDate?: string;
  scanType?: string;
};

export default function DevicesScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [form, setForm] = useState({ deviceName: "", ipAddress: "", macAddress: "", vendor: "", version: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortType, setSortType] = useState<'name'|'date'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await fetchScanHistory();
      setDevices(data);
    } catch (err) {
      console.error("Failed to load devices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openEdit = (device: Device) => {
    setEditingDevice(device);
    setForm({
      deviceName: device.deviceName,
      ipAddress: device.ipAddress,
      macAddress: device.macAddress,
      vendor: device.vendor || "",
      version: device.version || "",
    });
    setModalVisible(true);
  };

  const openCreate = () => {
    setEditingDevice(null);
    setForm({ deviceName: "", ipAddress: "", macAddress: "", vendor: "", version: "" });
    setModalVisible(true);
  };

  // validate for insert new user device: 
  
  const handleSave = async () => {
    const { deviceName, ipAddress, macAddress, vendor, version } = form;
    if (!deviceName || !ipAddress || !macAddress) {
      return alert("Please enter name, IP and MAC address");
    }
    try {
      if (editingDevice) {
        const updated = await updateDevice(editingDevice._id, { deviceName, ipAddress, macAddress, vendor, version });
        setDevices((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      } else {
        const created = await createDevice({ deviceName, ipAddress, macAddress, vendor, version });
        setDevices((prev) => [created, ...prev]);
      }
      setModalVisible(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const sortedDevices = devices.slice().sort((a, b) => {
    if (sortType === 'name') {
      return sortAsc
        ? a.deviceName.localeCompare(b.deviceName)
        : b.deviceName.localeCompare(a.deviceName);
    } else {
      const da = a.scanDate ? new Date(a.scanDate).getTime() : 0;
      const db = b.scanDate ? new Date(b.scanDate).getTime() : 0;
      return sortAsc ? da - db : db - da;
    }
  });

  const toggleSort = (type: 'name'|'date') => {
    if (sortType === type) setSortAsc(!sortAsc);
    else { setSortType(type); setSortAsc(true); }
  };

  const renderItem = ({ item }: { item: Device }) => {
    const expanded = item._id === expandedId;
    return (
      <TouchableOpacity
        style={styles.rowFront}
        activeOpacity={0.8}
        onPress={() => setExpandedId(expanded ? null : item._id)}
      >
        <Text style={styles.deviceName}>{item.deviceName}</Text>
        <Text style={styles.macText}>{item.macAddress}</Text>
        {expanded && (
          <View style={styles.details}>
            <Text style={styles.detailText}>IP: {item.ipAddress}</Text>
            <Text style={styles.detailText}>Date: {item.scanDate}</Text>
            <Text style={styles.detailText}>Type: {item.scanType}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({ item }: { item: Device }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity style={[styles.backBtn, styles.editBtn]} onPress={() => openEdit(item)}>
        <Icon name="pencil-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.backBtn, styles.deleteBtn]} onPress={() => handleDelete(item._id)}>
        <Icon name="trash-can-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWithBackButton title="Devices">
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Manage Devices</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => toggleSort('name')} style={styles.actionBtn}>
              <Icon name={sortType === 'name' && sortAsc ? "sort-alphabetical-ascending" : "sort-alphabetical-descending"} size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSort('date')} style={styles.actionBtn}>
              <Icon name={sortType === 'date' && sortAsc ? "sort-calendar-ascending" : "sort-calendar-descending"} size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={openCreate} style={styles.actionBtn}>
              <Icon name="plus-circle-outline" size={32} color="#4A90E2" />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loaderCenter} />
        ) : (
          <SwipeListView
            data={sortedDevices}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-75}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}


        <View style={styles.footer}>
          <Text style={styles.footerText}>You can manually add a device</Text>
          <TouchableOpacity style={styles.addBtnFooter} onPress={openCreate}>
            <Text style={styles.addBtnText}>Add New Device</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingDevice ? "Edit Device" : "Add Device"}</Text>
              <TextInput
                style={styles.input}
                placeholder="Device Name"
                value={form.deviceName}
                onChangeText={(t) => setForm({ ...form, deviceName: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="IP Address"
                value={form.ipAddress}
                onChangeText={(t) => setForm({ ...form, ipAddress: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="MAC Address"
                value={form.macAddress}
                onChangeText={(t) => setForm({ ...form, macAddress: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Vendor"
                value={form.vendor}
                onChangeText={(t) => setForm({ ...form, vendor: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="Version"
                value={form.version}
                onChangeText={(t) => setForm({ ...form, version: t })}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                  <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                    {editingDevice ? "Update" : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#333" },
  headerActions: { flexDirection: "row", alignItems: "center" },
  actionBtn: { marginLeft: 12 },
  rowFront: { backgroundColor: "#fff", borderRadius: 8, padding: 16, marginHorizontal: 16, marginVertical: 8, elevation: 2 },
  deviceName: { fontSize: 16, fontWeight: "500", color: "#333" },
  macText: { fontSize: 14, color: "#666", marginTop: 4 },
  details: { marginTop: 8 },
  detailText: { fontSize: 13, color: "#555" },
  rowBack: { flex: 1, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 16, marginVertical: 8 },
  backBtn: { width: 70, justifyContent: "center", alignItems: "center", borderRadius: 8, elevation: 2 },
  editBtn: { backgroundColor: "#4A90E2" },
  deleteBtn: { backgroundColor: "#FF3B30" },
  footer: { position: "absolute", bottom: 0, width, padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ddd", alignItems: "center" },
  footerText: { fontSize: 14, color: "#666" },
  addBtnFooter: { marginTop: 8, backgroundColor: "#4A90E2", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8 },
  addBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loaderCenter: { flex: 1, justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "#fff", borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginVertical: 6 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  cancelBtn: { backgroundColor: "#eee" },
  saveBtn: { backgroundColor: "#4A90E2" },
  modalBtnText: { fontSize: 14, fontWeight: "500", color: "#333" },
  loader: { flex: 1, justifyContent: "center" },
});
