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
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";
import {
  fetchScanHistory,
  deleteDevice,
  updateDevice,
  createDevice,
} from "@/services/api.jsx";

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
 
  type FormErrors = {
    deviceName?: string;
    ipAddress?: string;
    macAddress?: string;
    vendor?: string;
    version?: string;
  }; 
  const [errors, setErrors] = useState<FormErrors>({});

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
  const validateForm = () => {
    const newErrors: any = {};
  
    if (!form.deviceName || form.deviceName.length < 3) {
      newErrors.deviceName = "Enter at least 3 characters";
    }
  
    if (!form.macAddress || form.macAddress.length < 11) {
      newErrors.macAddress = "Enter full MAC address";
    }
  
    if (!form.vendor || form.vendor.length < 2) {
      newErrors.vendor = "Enter at least 2 characters";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
// end of validate to the manual insert device details.  
  
  const handleSave = async () => {
    console.log("▶️ handleSave triggered");
    if (!validateForm()) {
      console.log("Hey this is response from the if (!validateForm)");
      return; // this is validate from the function above. 
    }
    const { deviceName, ipAddress, macAddress, vendor, version } = form;
    
    try {
      if (editingDevice) {
        const updated = await updateDevice(editingDevice._id, { deviceName, ipAddress, macAddress, vendor, version });
        setDevices((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      } else {
        const created = await createDevice({ deviceName, ipAddress, macAddress, vendor, version });
        setDevices((prev) => [created, ...prev]);
      }
      setModalVisible(false);
    } catch (err: any) {
      console.error("Save failed:", err?.response?.data || err.message || err);
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
    <AppScreen title="Devices" showBackButton>
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

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputLabel}>Device Name (required)</Text>
         <TextInput
          style={[styles.input, !!errors.deviceName && { borderColor: "red" }]}
          placeholder="e.g. Bedroom Light"
          value={form.deviceName}
          onChangeText={(t) => setForm({ ...form, deviceName: t })}
        />
        {errors.deviceName && <Text style={styles.errorText}>{errors.deviceName}</Text>}
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputLabel}>IP Address (optional)</Text>
         <TextInput
          style={[styles.input, !!errors.ipAddress && { borderColor: "red" }]}
          placeholder="e.g. 192.168.0.20"
          value={form.ipAddress}
          onChangeText={(t) => setForm({ ...form, ipAddress: t })}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputLabel}>MAC Address (required)</Text>
         <TextInput
          style={[styles.input, !!errors.macAddress && { borderColor: "red" }]}
          placeholder="e.g. AA:BB:CC:DD:EE:FF"
          value={form.macAddress}
          onChangeText={(t) => setForm({ ...form, macAddress: t })}
        />
        {errors.macAddress && <Text style={styles.errorText}>{errors.macAddress}</Text>}
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputLabel}>Vendor (required)</Text>
         <TextInput
          style={[styles.input, !!errors.vendor && { borderColor: "red" }]}
          placeholder="e.g. TP-Link"
          value={form.vendor}
          onChangeText={(t) => setForm({ ...form, vendor: t })}
        />
        {errors.vendor && <Text style={styles.errorText}>{errors.vendor}</Text>}
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={styles.inputLabel}>Version (optional)</Text>
          <TextInput
          style={styles.input}
          placeholder="e.g. 1.0.0"
          value={form.version}
          onChangeText={(t) => setForm({ ...form, version: t })}
          />
      </View>

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
      </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  hintText: { fontSize: 12, color: "#666", marginTop: 4, marginLeft: 2 },
  errorText: { fontSize: 12, color: "red", marginTop: 2, marginLeft: 2 },
  inputLabel: { fontSize: 14, fontWeight: "500", color: "#444", marginBottom: 4 },

});
