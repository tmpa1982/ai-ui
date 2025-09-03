import Markdown from "react-markdown"
import type { LucideIcon } from 'lucide-react'

interface MessageProps {
  text: string;
  align?: 'left' | 'right';
  bgColor: string;
  textColor: string;
  timestamp?: Date;
  icon?: LucideIcon;
}

function Message({ text, align = 'left', bgColor, textColor, timestamp, icon: Icon }: MessageProps) {
  return (
    <div className="flex items-start gap-2">
      {Icon && align === 'left' && <Icon className="w-6 h-6 mt-2" />}
      <div className={`message user ${align === 'right' ? 'ml-auto' : ''} text-${align} ${bgColor} ${textColor} border-2 border-gray-500 rounded-2xl m-1 p-2 max-w-3/4 inline-block`}>
      {Icon && align === 'right' && <Icon className="w-6 h-6 mt-2" />}
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
