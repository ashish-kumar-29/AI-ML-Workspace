"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { sendChatMessage } from "../lib/api";


// ============================================================
// ROBOT ICON
// ============================================================

function RobotIcon({ size = 42 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="robotGradient"
          x1="8"
          y1="8"
          x2="56"
          y2="56"
        >
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <circle
        cx="32"
        cy="32"
        r="29"
        fill="#0f172a"
        stroke="url(#robotGradient)"
        strokeWidth="2"
      />

      <rect
        x="14"
        y="18"
        width="36"
        height="30"
        rx="11"
        fill="url(#robotGradient)"
      />

      <rect
        x="18"
        y="22"
        width="28"
        height="22"
        rx="8"
        fill="#111827"
      />

      <circle
        cx="26"
        cy="32"
        r="3.2"
        fill="#67e8f9"
      />

      <circle
        cx="38"
        cy="32"
        r="3.2"
        fill="#67e8f9"
      />

      <path
        d="M25 37C28.5 40.5 35.5 40.5 39 37"
        stroke="#67e8f9"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M32 18V12"
        stroke="#67e8f9"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle
        cx="32"
        cy="9"
        r="3"
        fill="#c084fc"
      />
    </svg>
  );
}


// ============================================================
// SEND ICON
// ============================================================

function SendIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M22 2L11 13"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


// ============================================================
// FORMAT AI RESPONSE
// ============================================================

function formatAIResponse(text) {

  if (!text) {
    return null;
  }

  const lines = String(text).split("\n");

  return lines.map((line, index) => {

    const trimmed = line.trim();

    // --------------------------------------------------------
    // Empty line
    // --------------------------------------------------------

    if (!trimmed) {
      return (
        <div
          key={index}
          style={styles.responseSpacer}
        />
      );
    }


    // --------------------------------------------------------
    // Markdown heading
    // --------------------------------------------------------

    if (
      trimmed.startsWith("### ")
    ) {

      return (
        <div
          key={index}
          style={styles.responseHeading}
        >
          {formatInlineMarkdown(
            trimmed.substring(4)
          )}
        </div>
      );
    }


    if (
      trimmed.startsWith("## ")
    ) {

      return (
        <div
          key={index}
          style={styles.responseHeading}
        >
          {formatInlineMarkdown(
            trimmed.substring(3)
          )}
        </div>
      );
    }


    // --------------------------------------------------------
    // Numbered list
    // --------------------------------------------------------

    const numberedMatch =
      trimmed.match(
        /^(\d+)\.\s+(.*)$/
      );

    if (numberedMatch) {

      return (
        <div
          key={index}
          style={styles.responseListItem}
        >

          <span
            style={styles.numberBadge}
          >
            {numberedMatch[1]}
          </span>

          <span>
            {formatInlineMarkdown(
              numberedMatch[2]
            )}
          </span>

        </div>
      );
    }


    // --------------------------------------------------------
    // Bullet list
    // --------------------------------------------------------

    if (
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {

      return (
        <div
          key={index}
          style={styles.responseListItem}
        >

          <span
            style={styles.bullet}
          >
            •
          </span>

          <span>
            {formatInlineMarkdown(
              trimmed.substring(2)
            )}
          </span>

        </div>
      );
    }


    // --------------------------------------------------------
    // Normal paragraph
    // --------------------------------------------------------

    return (
      <div
        key={index}
        style={styles.responseLine}
      >
        {formatInlineMarkdown(trimmed)}
      </div>
    );
  });
}


// ============================================================
// INLINE MARKDOWN
// ============================================================

function formatInlineMarkdown(text) {

  if (!text) {
    return null;
  }

  const parts =
    String(text).split(
      /(\*\*.*?\*\*|`.*?`)/g
    );

  return parts.map(
    (part, index) => {

      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {

        return (
          <strong
            key={index}
            style={styles.boldText}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }


      if (
        part.startsWith("`") &&
        part.endsWith("`")
      ) {

        return (
          <code
            key={index}
            style={styles.inlineCode}
          >
            {part.slice(1, -1)}
          </code>
        );
      }


      return (
        <span key={index}>
          {part}
        </span>
      );
    }
  );
}


// ============================================================
// AI CHATBOT
// ============================================================

export default function AIChatbot() {

  const [isOpen, setIsOpen] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hi! I'm DataMind AI 👋\n\n" +
          "I can help you understand your dataset, " +
          "explain data-quality issues, and answer " +
          "questions about your analysis.\n\n" +
          "What would you like to know?",
      },
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [conversationId] =
    useState(
      () => `chat_${Date.now()}`
    );

  const messagesEndRef =
    useRef(null);

  const textareaRef =
    useRef(null);


  // ==========================================================
  // AUTO SCROLL
  // ==========================================================

  useEffect(() => {

    const scrollToBottom = () => {

      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

    };

    scrollToBottom();

  }, [messages, loading]);


  // ==========================================================
  // FOCUS INPUT WHEN OPENED
  // ==========================================================

  useEffect(() => {

    if (isOpen) {

      setTimeout(() => {

        textareaRef.current?.focus();

      }, 150);
    }

  }, [isOpen]);


  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  const handleSend = async () => {

    const query =
      input.trim();

    if (!query || loading) {
      return;
    }


    setMessages(
      (previous) => [
        ...previous,

        {
          role: "user",
          content: query,
        },
      ]
    );

    setInput("");
    setLoading(true);


    try {

      const result =
        await sendChatMessage(
          query,
          conversationId
        );


      const answer =
        result?.answer ||
        "I couldn't generate a response.";


      setMessages(
        (previous) => [
          ...previous,

          {
            role: "assistant",
            content: answer,
            sources:
              result?.sources || [],
            confidence:
              result?.confidence,
          },
        ]
      );

    } catch (error) {

      console.error(
        "DataMind AI Chat Error:",
        error
      );

      setMessages(
        (previous) => [
          ...previous,

          {
            role: "assistant",

            content:
              error?.response?.data?.detail ||
              error?.message ||
              "Unable to connect to DataMind AI.",

            error: true,
          },
        ]
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // KEYBOARD HANDLER
  // ==========================================================

  const handleKeyDown =
    (event) => {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        handleSend();
      }
    };


  // ==========================================================
  // QUICK SUGGESTION
  // ==========================================================

  const handleSuggestion =
    (text) => {

      setInput(text);

      setTimeout(() => {

        textareaRef.current?.focus();

      }, 50);
    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>

      {/* ==================================================== */}
      {/* FLOATING BUTTON */}
      {/* ==================================================== */}

      {!isOpen && (

        <button
          onClick={() =>
            setIsOpen(true)
          }

          aria-label="Open DataMind AI"

          style={
            styles.floatingButton
          }
        >

          <div
            style={
              styles.floatingGlow
            }
          />

          <RobotIcon size={48} />

          <span
            style={
              styles.sparkleOne
            }
          >
            ✦
          </span>

          <span
            style={
              styles.sparkleTwo
            }
          >
            ✧
          </span>

        </button>
      )}


      {/* ==================================================== */}
      {/* CHAT WINDOW */}
      {/* ==================================================== */}

      {isOpen && (

        <div style={styles.overlay}>

          <div
            className="datamind-chat-window"
            style={
              styles.chatWindow
            }
          >

            {/* ============================================== */}
            {/* HEADER */}
            {/* ============================================== */}

            <div style={styles.header}>

              <div
                style={
                  styles.headerLeft
                }
              >

                <div
                  style={
                    styles.headerIcon
                  }
                >
                  <RobotIcon size={52} />
                </div>

                <div>

                  <div
                    style={styles.title}
                  >
                    DataMind AI
                  </div>

                  <div
                    style={
                      styles.subtitle
                    }
                  >

                    <span
                      style={
                        styles.onlineDot
                      }
                    />

                    AI data assistant

                  </div>

                </div>

              </div>


              <button
                onClick={() =>
                  setIsOpen(false)
                }

                style={
                  styles.closeButton
                }

                aria-label="Close chatbot"
              >
                ×
              </button>

            </div>


            {/* ============================================== */}
            {/* MESSAGES */}
            {/* ============================================== */}

            <div
              className="datamind-messages"
              style={
                styles.messages
              }
            >

              {messages.map(
                (message, index) => (

                  <div
                    key={index}

                    style={{
                      ...styles.messageRow,

                      justifyContent:
                        message.role === "user"
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >

                    {message.role ===
                      "assistant" && (

                      <div
                        style={
                          styles.avatar
                        }
                      >

                        <RobotIcon size={32} />

                      </div>
                    )}


                    <div
                      style={{
                        ...styles.messageBubble,

                        ...(message.role ===
                        "user"
                          ? styles.userBubble
                          : styles.assistantBubble),

                        ...(message.error
                          ? styles.errorBubble
                          : {}),
                      }}
                    >

                      {message.role ===
                        "assistant"
                        ? formatAIResponse(
                            message.content
                          )
                        : (
                          <div>
                            {message.content}
                          </div>
                        )}


                      {/* ================================== */}
                      {/* SOURCES */}
                      {/* ================================== */}

                      {message.sources &&
                        message.sources.length >
                          0 && (

                          <div
                            style={
                              styles.sourceContainer
                            }
                          >

                            <span
                              style={
                                styles.sourceLabel
                              }
                            >
                              Based on
                            </span>

                            {message.sources.map(
                              (
                                source,
                                sourceIndex
                              ) => (

                                <span
                                  key={`${source}-${sourceIndex}`}

                                  style={{
                                    ...styles.sourceBadge,

                                    ...(source ===
                                    "memory"
                                      ? styles.memoryBadge
                                      : {}),
                                  }}
                                >
                                  {String(
                                    source
                                  ).toUpperCase()}
                                </span>
                              )
                            )}

                          </div>
                        )}

                    </div>

                  </div>
                )
              )}


              {/* ========================================== */}
              {/* TYPING INDICATOR */}
              {/* ========================================== */}

              {loading && (

                <div
                  style={
                    styles.messageRow
                  }
                >

                  <div
                    style={
                      styles.avatar
                    }
                  >

                    <RobotIcon size={32} />

                  </div>

                  <div
                    style={{
                      ...styles.messageBubble,
                      ...styles.assistantBubble,
                    }}
                  >

                    <div
                      style={
                        styles.typing
                      }
                    >

                      <span
                        style={
                          styles.typingDot
                        }
                      />

                      <span
                        style={{
                          ...styles.typingDot,
                          animationDelay:
                            "0.15s",
                        }}
                      />

                      <span
                        style={{
                          ...styles.typingDot,
                          animationDelay:
                            "0.3s",
                        }}
                      />

                    </div>

                  </div>

                </div>
              )}


              <div
                ref={messagesEndRef}
              />

            </div>


            {/* ============================================== */}
            {/* QUICK ACTIONS */}
            {/* ============================================== */}

            <div
              className="datamind-quick-actions"
              style={
                styles.quickActions
              }
            >

              <button
                onClick={() =>
                  handleSuggestion(
                    "Suggest a fix for Age"
                  )
                }

                style={
                  styles.quickButton
                }
              >
                💡 Fix Age
              </button>


              <button
                onClick={() =>
                  handleSuggestion(
                    "Show Age distribution"
                  )
                }

                style={
                  styles.quickButton
                }
              >
                📊 Age distribution
              </button>


              <button
                onClick={() =>
                  handleSuggestion(
                    "Why is Age problematic?"
                  )
                }

                style={
                  styles.quickButton
                }
              >
                🧠 Explain Age
              </button>

            </div>


            {/* ============================================== */}
            {/* INPUT */}
            {/* ============================================== */}

            <div
              style={
                styles.inputArea
              }
            >

              <textarea
                ref={textareaRef}

                value={input}

                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }

                onKeyDown={
                  handleKeyDown
                }

                placeholder={
                  "Ask DataMind AI about your data..."
                }

                rows={2}

                disabled={loading}

                style={
                  styles.input
                }
              />


              <button
                onClick={handleSend}

                disabled={
                  loading ||
                  !input.trim()
                }

                style={{
                  ...styles.sendButton,

                  opacity:
                    loading ||
                    !input.trim()
                      ? 0.45
                      : 1,

                  cursor:
                    loading ||
                    !input.trim()
                      ? "not-allowed"
                      : "pointer",
                }}

                aria-label="Send message"
              >

                <SendIcon />

              </button>

            </div>


            {/* ============================================== */}
            {/* DISCLAIMER */}
            {/* ============================================== */}

            <div
              style={
                styles.disclaimer
              }
            >

              DataMind AI can make mistakes.
              Verify important insights.

            </div>

          </div>

        </div>
      )}


      {/* ==================================================== */}
      {/* RESPONSIVE CSS */}
      {/* ==================================================== */}

      <style jsx global>{`

        @keyframes datamindTyping {

          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }

          30% {
            transform: translateY(-4px);
            opacity: 1;
          }

        }


        @media (max-width: 640px) {

          .datamind-chat-window {

            right: 10px !important;
            left: 10px !important;

            bottom: 10px !important;

            width: auto !important;

            height:
              calc(100dvh - 20px) !important;

            max-height:
              calc(100dvh - 20px) !important;

            border-radius:
              20px !important;

          }

        }


        @media (max-width: 480px) {

          .datamind-quick-actions {

            padding-left: 12px !important;
            padding-right: 12px !important;

          }

        }

      `}</style>

    </>
  );
}


// ============================================================
// STYLES
// ============================================================

const styles = {

  // ==========================================================
  // OVERLAY
  // ==========================================================

  overlay: {

    position: "fixed",

    inset: 0,

    zIndex: 9998,

    pointerEvents: "none",
  },


  // ==========================================================
  // CHAT WINDOW
  // ==========================================================

  chatWindow: {

    pointerEvents: "auto",

    position: "fixed",

    right: "28px",

    bottom: "28px",

    width:
      "min(620px, calc(100vw - 40px))",

    height:
      "min(720px, calc(100dvh - 32px))",

    maxHeight:
      "calc(100dvh - 32px)",

    display: "flex",

    flexDirection: "column",

    overflow: "hidden",

    borderRadius: "24px",

    background:
      "linear-gradient(145deg, #080d1f 0%, #0d1430 55%, #111936 100%)",

    border:
      "1px solid rgba(139, 92, 246, 0.75)",

    boxShadow:
      "0 0 0 1px rgba(59,130,246,0.15), " +
      "0 25px 80px rgba(0,0,0,0.45), " +
      "0 0 60px rgba(124,58,237,0.18)",
  },


  // ==========================================================
  // HEADER
  // ==========================================================

  header: {

    flexShrink: 0,

    padding:
      "18px 22px",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    background:
      "linear-gradient(135deg, rgba(20,24,55,0.98), rgba(13,20,48,0.98))",

    borderBottom:
      "1px solid rgba(148,163,184,0.16)",
  },


  headerLeft: {

    display: "flex",

    alignItems: "center",

    gap: "14px",
  },


  headerIcon: {

    width: "56px",

    height: "56px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "17px",

    background:
      "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(34,211,238,0.12))",

    boxShadow:
      "0 0 25px rgba(139,92,246,0.25)",
  },


  title: {

    fontSize: "24px",

    fontWeight: "800",

    background:
      "linear-gradient(90deg, #c084fc, #818cf8, #67e8f9)",

    WebkitBackgroundClip:
      "text",

    WebkitTextFillColor:
      "transparent",
  },


  subtitle: {

    marginTop: "4px",

    display: "flex",

    alignItems: "center",

    gap: "6px",

    color: "#94a3b8",

    fontSize: "13px",
  },


  onlineDot: {

    width: "7px",

    height: "7px",

    borderRadius: "50%",

    background: "#34d399",

    boxShadow:
      "0 0 8px rgba(52,211,153,0.8)",
  },


  closeButton: {

    width: "42px",

    height: "42px",

    borderRadius: "12px",

    border:
      "1px solid rgba(148,163,184,0.2)",

    background:
      "rgba(15,23,42,0.65)",

    color: "#ffffff",

    fontSize: "28px",

    lineHeight: 1,

    cursor: "pointer",
  },


  // ==========================================================
  // MESSAGES
  // ==========================================================

  messages: {

    flex: "1 1 auto",

    minHeight: 0,

    overflowY: "auto",

    overflowX: "hidden",

    padding: "24px 22px",

    background:
      "radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 35%)",

    scrollbarWidth: "thin",

    scrollbarColor:
      "rgba(129,140,248,0.55) transparent",
  },


  messageRow: {

    display: "flex",

    alignItems: "flex-start",

    gap: "10px",

    marginBottom: "18px",
  },


  avatar: {

    flexShrink: 0,

    width: "38px",

    height: "38px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "50%",

    background:
      "rgba(99,102,241,0.12)",

    boxShadow:
      "0 0 18px rgba(99,102,241,0.22)",
  },


  messageBubble: {

    maxWidth: "82%",

    padding: "15px 17px",

    borderRadius: "16px",

    fontSize: "14px",

    lineHeight: 1.65,

    overflowWrap: "anywhere",

    wordBreak: "break-word",
  },


  assistantBubble: {

    color: "#e2e8f0",

    background:
      "linear-gradient(145deg, rgba(30,41,79,0.92), rgba(15,23,52,0.95))",

    border:
      "1px solid rgba(99,102,241,0.2)",

    borderBottomLeftRadius: "5px",
  },


  userBubble: {

    color: "#ffffff",

    background:
      "linear-gradient(135deg, #9333ea, #6366f1, #3b82f6)",

    borderBottomRightRadius: "5px",

    boxShadow:
      "0 8px 25px rgba(99,102,241,0.22)",
  },


  errorBubble: {

    color: "#fecaca",

    border:
      "1px solid rgba(248,113,113,0.35)",
  },


  // ==========================================================
  // RESPONSE FORMATTING
  // ==========================================================

  responseLine: {

    marginBottom: "5px",
  },


  responseSpacer: {

    height: "7px",
  },


  responseHeading: {

    marginTop: "4px",

    marginBottom: "8px",

    color: "#f8fafc",

    fontSize: "15px",

    fontWeight: "800",
  },


  responseListItem: {

    display: "flex",

    alignItems: "flex-start",

    gap: "9px",

    marginBottom: "9px",

    paddingLeft: "2px",
  },


  numberBadge: {

    flexShrink: 0,

    width: "22px",

    height: "22px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "7px",

    background:
      "rgba(139,92,246,0.22)",

    border:
      "1px solid rgba(139,92,246,0.35)",

    color: "#d8b4fe",

    fontSize: "11px",

    fontWeight: "800",
  },


  bullet: {

    flexShrink: 0,

    color: "#a78bfa",

    fontSize: "18px",

    lineHeight: "20px",
  },


  boldText: {

    color: "#f8fafc",

    fontWeight: "800",
  },


  inlineCode: {

    padding: "2px 6px",

    borderRadius: "5px",

    background:
      "rgba(15,23,42,0.8)",

    border:
      "1px solid rgba(148,163,184,0.2)",

    color: "#67e8f9",

    fontSize: "12px",

    fontFamily:
      "var(--font-geist-mono), monospace",
  },


  // ==========================================================
  // SOURCES
  // ==========================================================

  sourceContainer: {

    display: "flex",

    alignItems: "center",

    gap: "6px",

    flexWrap: "wrap",

    marginTop: "12px",

    paddingTop: "10px",

    borderTop:
      "1px solid rgba(148,163,184,0.15)",
  },


  sourceLabel: {

    color: "#94a3b8",

    fontSize: "11px",

    marginRight: "3px",
  },


  sourceBadge: {

    padding: "3px 8px",

    borderRadius: "999px",

    background:
      "rgba(139,92,246,0.22)",

    border:
      "1px solid rgba(139,92,246,0.4)",

    color: "#d8b4fe",

    fontSize: "10px",

    fontWeight: "700",
  },


  memoryBadge: {

    background:
      "rgba(59,130,246,0.2)",

    borderColor:
      "rgba(59,130,246,0.4)",

    color: "#93c5fd",
  },


  // ==========================================================
  // TYPING
  // ==========================================================

  typing: {

    display: "flex",

    gap: "5px",

    alignItems: "center",

    height: "20px",
  },


  typingDot: {

    width: "7px",

    height: "7px",

    borderRadius: "50%",

    background: "#a78bfa",

    animation:
      "datamindTyping 1.2s infinite ease-in-out",
  },


  // ==========================================================
  // QUICK ACTIONS
  // ==========================================================

  quickActions: {

    flexShrink: 0,

    display: "flex",

    gap: "8px",

    padding: "10px 20px 14px",

    overflowX: "auto",

    overflowY: "hidden",

    scrollbarWidth: "none",
  },


  quickButton: {

    flexShrink: 0,

    padding: "9px 12px",

    borderRadius: "10px",

    border:
      "1px solid rgba(99,102,241,0.25)",

    background:
      "rgba(30,41,79,0.55)",

    color: "#cbd5e1",

    fontSize: "12px",

    cursor: "pointer",
  },


  // ==========================================================
  // INPUT
  // ==========================================================

  inputArea: {

    flexShrink: 0,

    display: "flex",

    alignItems: "flex-end",

    gap: "10px",

    margin: "0 20px",

    padding: "12px",

    borderRadius: "16px",

    background:
      "rgba(15,23,42,0.9)",

    border:
      "1px solid rgba(99,102,241,0.45)",

    boxShadow:
      "0 0 25px rgba(99,102,241,0.08)",
  },


  input: {

    flex: 1,

    resize: "none",

    border: "none",

    outline: "none",

    background: "transparent",

    color: "#f8fafc",

    fontSize: "14px",

    lineHeight: 1.5,

    fontFamily: "inherit",
  },


  sendButton: {

    flexShrink: 0,

    width: "48px",

    height: "48px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    border: "none",

    borderRadius: "13px",

    background:
      "linear-gradient(135deg, #9333ea, #6366f1, #3b82f6)",

    cursor: "pointer",

    boxShadow:
      "0 8px 22px rgba(99,102,241,0.3)",
  },


  // ==========================================================
  // DISCLAIMER
  // ==========================================================

  disclaimer: {

    flexShrink: 0,

    padding: "10px 20px 14px",

    textAlign: "center",

    color: "#64748b",

    fontSize: "10px",
  },


  // ==========================================================
  // FLOATING BUTTON
  // ==========================================================

  floatingButton: {

    position: "fixed",

    right: "28px",

    bottom: "28px",

    width: "76px",

    height: "76px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    border: "none",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg, #7c3aed, #6366f1, #06b6d4)",

    cursor: "pointer",

    zIndex: 9999,

    boxShadow:
      "0 0 0 5px rgba(99,102,241,0.12), " +
      "0 0 35px rgba(124,58,237,0.5), " +
      "0 15px 35px rgba(0,0,0,0.3)",

    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },


  floatingGlow: {

    position: "absolute",

    inset: "-7px",

    borderRadius: "50%",

    border:
      "1px solid rgba(167,139,250,0.35)",

    pointerEvents: "none",
  },


  sparkleOne: {

    position: "absolute",

    top: "-3px",

    right: "4px",

    color: "#c084fc",

    fontSize: "17px",
  },


  sparkleTwo: {

    position: "absolute",

    bottom: "4px",

    left: "0px",

    color: "#67e8f9",

    fontSize: "13px",
  },
};