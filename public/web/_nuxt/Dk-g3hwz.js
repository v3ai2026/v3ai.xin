import"#entry";const e=""+new URL("icon.B8dxjI9e.png",import.meta.url).href,s={id:"c8h4t1b5-2u7b-4b1e-9c8h-1a2t3b4u5b6l",type:"chat-bubbles",title:"console-widgets.components.chatBubbles",icon:e,isHidden:!1,category:{id:"extension",title:"console-widgets.categories.extension"},size:{width:500,height:400,widthMode:"fixed",heightMode:"fixed"},order:13,props:{messages:[{id:"1",content:"你好！我是AI助手，很高兴为您服务。有什么可以帮助您的吗？",role:"assistant",sender:"AI助手",avatar:"https://api.dicebear.com/7.x/bottts/svg?seed=ai"},{id:"2",content:"请帮我写一个Vue组件的示例代码",role:"user",sender:"用户",avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed=user"},{id:"3",content:`当然可以！这里是一个简单的Vue组件示例：

\`\`\`vue
<template>
  <div class="hello-world">
    <h1>{{ message }}</h1>
    <button @click="updateMessage">点击更新</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello, World!')

const updateMessage = () => {
  message.value = '消息已更新！'
}
<\/script>
\`\`\``,role:"assistant",sender:"AI助手",avatar:"https://api.dicebear.com/7.x/bottts/svg?seed=ai"}],showAvatar:!0,showSender:!0,alignment:"separate",sideAlignment:"left",maxWidthPercent:80,messageSpacing:12,style:{rootBgColor:"",bgColor:"#ffffff",paddingTop:16,paddingRight:16,paddingBottom:16,paddingLeft:16,borderRadiusTop:12,borderRadiusBottom:12,contentPaddingTop:8,contentPaddingRight:8,contentPaddingBottom:8,contentPaddingLeft:8,userBubbleBg:"#3b82f6",userTextColor:"#ffffff",assistantBubbleBg:"#f1f5f9",assistantTextColor:"#334155",avatarSize:32,bubbleRadius:8,senderNameColor:"#64748b"}}};export{s as chatBubbleConfig};
