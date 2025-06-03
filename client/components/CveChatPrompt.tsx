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
          <Text style={styles.openText}> 🔍 Need help? Tap to analyze CVE  </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={[styles.headerRow, { backgroundColor: '#007bff', borderRadius: 10, padding: 10 }]}>
            <Text style={[styles.header, { color: '#fff' }]}>💬 CVE Chat Assistant</Text>
              <TouchableOpacity onPress={() => setExpanded(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#fff" />
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
    bottom: 100,
    left: 20,
    backgroundColor: '#ffffff',
    borderColor: '#007bff',
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  containerExpanded: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    left: 10, 
    height: '65%',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
  },
  openText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 15,
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
    fontSize: 15,
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
