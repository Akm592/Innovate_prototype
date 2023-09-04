import { useState, useRef, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import logo from './dnk2.png';
import g20 from './g20.jpg';

const API_KEY = "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";
const systemMessage = {
  role: "system",
  content: "You are expert good exporter from India,\nand your name is \"Dak ghar niryat\"",
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm DNK! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messageListRef = useRef(null);

  useEffect(() => {
    scrollMessageListToBottom();
  }, [messages]);

  const scrollMessageListToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data);

        if (data.choices && data.choices[0]) {
          setMessages([...chatMessages, {
            message: data.choices[0].message.content,
            sender: "ChatGPT"
          }]);
        } else {
          setMessages([...chatMessages, {
            message: "Oops! Something went wrong.",
            sender: "ChatGPT"
          }]);
        }

        setIsTyping(false);
      }).catch((error) => {
        console.error("Error:", error);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div className="header">
        <img src={logo} id="img1" alt="DNK logo" />
        <h1 className="heading">Dak Ghar Niryat Kendra</h1>
        <img src={g20} id="img2" alt="G20 logo" />
      </div>
      <h1 id="chat_head">Welcome to Dak Ghar Niryat Kendra chat section:</h1>
      <div className="chatbot">
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="DNK is typing" /> : null}
              ref={messageListRef}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={{ ...message }} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;