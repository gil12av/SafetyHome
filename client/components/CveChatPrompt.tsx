import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { askCveGpt, getCveGptHistory } from '@/services/api.jsx';
import { MaterialCommunityIcons } from '@expo/vector-icons';


type GptMessage = {
    _id: string;
    sender: "user" | "bot";
    content: string;
  };

  
export default function CveChatPrompt() {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<GptMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<GptMessage> | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getCveGptHistory();
        setMessages(history);
      } catch (err) {
        console.warn('No CVE chat history found');
      }
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const isFirstMessage = messages.length === 0;
    const cveCode = isFirstMessage ? input.trim() : null;

    const userMessage: GptMessage = {
        _id: Date.now().toString(),
        sender: "user",
        content: input,
      };      
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const fullPrompt = isFirstMessage
        ? `A user has submitted the vulnerability code: ${cveCode}.\n\nBased on this vulnerability, please provide the following:\n1. Recommended actions to mitigate the issue\n2. How these steps help protect the user\n3. A short explanation on why it’s important to fix this in smart home environments`
        : input;

      const response = await askCveGpt({ prompt: fullPrompt, cveCode });

      const botMessage: GptMessage = {
        _id: Date.now().toString() + "-bot",
        sender: "bot",
        content: response,
      };      
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
        const errorMsg: GptMessage = {
            _id: Date.now().toString() + "-error",
            sender: "bot",
            content: "❌ Error retrieving response. Please try again.",
          };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: GptMessage }) => (
    <View style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.text}>{item.content}</Text>
    </View>
  );

  return (
    <Animated.View style={expanded ? styles.containerExpanded : styles.containerCollapsed}>
      {!expanded ? (
        <TouchableOpacity onPress={() => setExpanded(true)} style={styles.openButton}>
          <MaterialCommunityIcons name="chat-question" size={20} color="#007bff" />
          <Text style={styles.openText}> Ask chat about a specific CVE</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>💬 CVE Chat Assistant</Text>
            <TouchableOpacity onPress={() => setExpanded(false)}>
              <MaterialCommunityIcons name="close" size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>Paste a CVE ID (e.g. CVE-2023-XXXXX) to get actionable tips. Follow-up questions are supported.</Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContainer}
          />

          {loading && <ActivityIndicator size="small" color="gray" style={{ marginBottom: 10 }} />}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type here..."
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  containerCollapsed: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 12,
    elevation: 5,
  },
  containerExpanded: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '90%',
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 10,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openText: {
    color: '#007bff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  chatContainer: {
    paddingBottom: 10,
    flexGrow: 1,
  },
  bubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#cce5ff',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e2e2',
  },
  text: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 6,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
