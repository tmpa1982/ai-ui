import Markdown from "react-markdown"

interface MessageProps {
  text: string;
  align?: 'left' | 'right';
  bgColor: string;
  textColor: string;
  timestamp?: Date;
}

function Message({ text, align = 'left', bgColor, textColor, timestamp }: MessageProps) {
  return (
    <div className="flex">
      <div className={`message user ${align === 'right' ? 'ml-auto' : ''} text-${align} ${bgColor} ${textColor} border-2 border-gray-500 rounded-2xl m-1 p-2 max-w-3/4 inline-block`}>
        <Markdown>{text}</Markdown>
        {timestamp && (
          <div className="text-xs text-gray-500 mt-1">
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Message
