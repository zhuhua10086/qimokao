<template>
  <div class="home-container">
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
        Configuration
      </div>
      <el-form ref="configForm" hide-required-asterisk size="small" label-position="top" :model="connection">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="host" label="Host">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-select v-model="connection.protocol" @change="handleProtocolChange">
                    <el-option label="ws://" value="ws"></el-option>
                    <el-option label="wss://" value="wss"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="17">
                  <el-input v-model="connection.host"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="port" label="Port">
              <el-input v-model.number="connection.port" type="number" placeholder="8083/8084"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="endpoint" label="Mountpoint">
              <el-input v-model="connection.endpoint" placeholder="/mqtt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="clientId" label="Client ID">
              <el-input v-model="connection.clientId"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="username" label="Username">
              <el-input v-model="connection.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" label="Password">
              <el-input v-model="connection.password"></el-input>
            </el-form-item>
          </el-col>

				<el-checkbox v-model="checkedList.option1" @change="handleCheckboxChange('option1')">Clean Session</el-checkbox>
		      <el-checkbox v-model="checkedList.option2" @change="handleCheckboxChange('option2')">SSL</el-checkbox>
		  
		      <div v-if="checkedList.option1">ws://jqrjq.cn:8083/mqtt</div>
		      <div v-if="checkedList.option2">wss://jqrjq.cn:8084/mqtt</div>

          <el-col :span="24">
            <el-button
              type="success"
              size="small"
              class="conn-btn"
              style="margin-right: 20px;"
              :disabled="client.connected"
              @click="createConnection"
              :loading="connecting"
            >
              {{ client.connected ? 'Connected' : 'Connect' }}
            </el-button>

            <el-button v-if="client.connected" type="danger" size="small" class="conn-btn" @click="destroyConnection">
              Disconnect
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
        Subscribe
      </div>
      <el-form ref="subscription" hide-required-asterisk size="small" label-position="top" :model="subscription">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="topic" label="Topic">
              <el-input v-model="subscription.topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="subscription.qos">
                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
           <!-- <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              @click="doSubscribe"
            >
              {{ subscribeSuccess ? 'Subscribed' : 'Subscribe' }}
            </el-button>
            <el-button
              :disabled="!client.connected"
              type="success"
              size="small"
              class="subscribe-btn"
              style="margin-left:20px"
              @click="doUnSubscribe"
              v-if="subscribeSuccess"
            >
              Unsubscribe
            </el-button> -->
			
			  <el-button
			    type="success"
			    size="small"
			    class="conn-btn"
			    style="margin-right: 20px;"
			    :disabled="!client.connected"
			    @click="doSubscribe"
			    :loading="connecting"
			  >
			    {{ subscribeSuccess ? 'Subscribed' : 'Subscribe' }}
			  </el-button>
			
			  <el-button v-if="subscribeSuccess" type="danger" size="small" class="conn-btn" @click="doUnSubscribe">
			    Unsubscribe
			  </el-button>
			
			
			
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
        Messages
      </div>
      <el-form ref="publish" hide-required-asterisk size="small" label-position="top" :model="publish">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="topic" label="Topic">
              <el-input v-model="publish.topic"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="message" label="message">
              <el-input v-model="publish.message"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="qos" label="QoS">
              <el-select v-model="publish.qos">
                <el-option v-for="qos in qosList" :key="qos" :label="qos" :value="qos"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="24">
        <el-button :disabled="client.connected" type="success" size="small" class="publish-btn" @click="doPublish">
          Publish
        </el-button>
      </el-col>
    </el-card>
    <el-card shadow="always" style="margin-bottom:30px;">
      <div class="emq-title">
        Receive
      </div>
      <el-col :span="24">
        <el-input type="textarea" :rows="3" style="margin-bottom: 15px" v-model="receiveNews" readOnly></el-input>
      </el-col>
    </el-card>
  </div>
</template>

<script>
import mqtt from 'mqtt/dist/mqtt';
import { 
  ElCard, 
  ElForm, 
  ElRow, 
  ElCol, 
  ElSelect, 
  ElOption, 
  ElInput, 
  ElButton,
  ElFormItem,
  ElCheckbox
} from 'element-plus';

export default {
  name: 'Home',
	components: {
		ElCard,
		ElForm,
		ElRow,
		ElCol,
		ElSelect,
		ElOption,
		ElInput,
		ElButton,
		ElFormItem,
		ElCheckbox
	  },
  data() {
    return {
      connection: {
        protocol: 'ws',
        host: 'jqrjq.cn',
        // ws: 8083; wss: 8084
        port: 8083,
        endpoint: '/mqtt',
        // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
        clean: true,
        connectTimeout: 30 * 1000, // ms
        reconnectPeriod: 4000, // ms
        clientId:
          'emqx_vue_' +
          Math.random()
            .toString(16)
            .substring(2, 8),
        // auth
        username: 'admin',
        password: 'public',
		subscribeButtonDisabled() {
		    return !this.client.connected || this.connecting || this.subscribeSuccess;
		  }
		
      },
	   checkedList: {
	          option1: true,
	          option2: false
	        },
      subscription: {
        topic: 'testtopic/#',
        qos: 0,
      },
      publish: {
        topic: 'testtopic',
        qos: 0,
        message: '{ "msg": "Hello, I am browser." }',
      },
      receiveNews: '',
      qosList: [0, 1, 2],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
      connecting: false,
      retryTimes: 0,
    }
  },
  methods: {
    initData() {
      this.client = {
        connected: false,
      }
      this.retryTimes = 0
      this.connecting = false
      this.subscribeSuccess = false
    },
    handleOnReConnect() {
      this.retryTimes += 1
      if (this.retryTimes > 5) {
        try {
          this.client.end()
          this.initData()
          this.$message.error('Connection maxReconnectTimes limit, stop retry')
        } catch (error) {
          this.$message.error(error.toString())
        }
      }
    },
    createConnection() {
      try {
        this.connecting = true
        const { protocol, host, port, endpoint, ...options } = this.connection
        const connectUrl = `${protocol}://${host}:${port}${endpoint}`
        this.client = mqtt.connect(connectUrl, options)
        if (this.client.on) {
          this.client.on('connect', () => {
            this.connecting = false
            console.log('Connection succeeded!')
			// 连接成功后立即订阅一个主题
			        this.doSubscribe();
					this.doPublish();
          })
          this.client.on('reconnect', this.handleOnReConnect)
          this.client.on('error', error => {
            console.log('Connection failed', error)
          })
          this.client.on('message', (topic, message) => {
            this.receiveNews = this.receiveNews.concat(message)
            console.log(`已接收 message ${message} from topic ${topic}`)
          })
        }
      } catch (error) {
        this.connecting = false
        console.log('mqtt.connect error', error)
      }
    },
    // subscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        this.subscribeSuccess = true
        console.log('接收', res)
      })
    },
    // unsubscribe topic
    // https://github.com/mqttjs/MQTT.js#mqttclientunsubscribetopictopic-array-options-callback
    doUnSubscribe() {
      const { topic } = this.subscription
      this.client.unsubscribe(topic, error => {
        if (error) {
          console.log('Unsubscribe error', error)
		  return
        }
		this.subscribeSuccess = false
		console.log('关闭接收');
      })
    },
    // publish message
    // https://github.com/mqttjs/MQTT.js#mqttclientpublishtopic-message-options-callback
    
	doPublish() {
	  const { topic, qos, message } = this.publish;
	  this.client.publish(topic, message, { qos }, error => {
	    if (error) {
	      console.log('Publish error', error);
	    }else {
       console.log(` 已发送 Topic: ${topic}, message: ${message}`);
    }
	  });
	},

    // disconnect
    // https://github.com/mqttjs/MQTT.js#mqttclientendforce-options-callback
    destroyConnection() {
      if (this.client.connected) {
        try {
          this.client.end(false, () => {
            this.initData()
            console.log('Successfully disconnected!')
          })
        } catch (error) {
          console.log('Disconnect failed', error.toString())
        }
      }
    },
    handleProtocolChange(value) {
      this.connection.port = value === 'wss' ? '8084' : '8083'
    },
	 handleCheckboxChange(option) {
	      // 根据复选框的选中状态来处理不同的逻辑
	      if (option === 'option1') {
	        // 处理 Option 1 复选框的状态变化
			 this.checkedList.option2 = false;
	      } else if (option === 'option2') {
	        // 处理 Option 2 复选框的状态变化
			this.checkedList.option1 = false; 
	      }
	    },
	
  },
}
</script>

<style lang="scss">
@import url('@/assets/style/home.scss');

.home-container {
  max-width: 1100px;
  margin-left: 20px;

  .conn-btn {
    color: #fff;
    background-color: #00b173;
    font-size: 14px;
  }

  .publish-btn {
    margin-bottom: 20px;
    float: left;
  }

  .el-button--success {
    background-color: #34c388 !important;
    border-color: #34c388 !important;
    font-size: 14px !important;
  }

  .el-button--danger {
    background-color: #f5222d !important;
    border-color: #f5222d !important;
  }

  .el-form-item {
    &.is-error {
      .el-input__inner,
      .el-textarea__inner {
        box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
      }
    }
    &.is-success {
      .el-input__inner,
      .el-textarea__inner {
        border-color: #34c388 !important;
      }
    }
  }
}
</style>
