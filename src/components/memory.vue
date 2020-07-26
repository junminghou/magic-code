<template>
  <div style="font-family: 微软雅黑; font-size: 30px; color: #87e8de;" >
    <div style="top: 40%; left: 40%; position: absolute;">{{show_text}}</div>
    <div style="position: absolute; bottom: 0; left: 42%; margin-bottom: 50px;">
      <div style="text-align:center;">{{percentage}}</div>
      <i-select v-model="sections_selected" style="width:200px">
        <i-option v-for="item in sections" :value="item.value" :key="item.value">{{ item.text }}</i-option>
      </i-select>
      <div>
        <i-button @click="showAction(button_text)" style="width: 95px;">{{button_text}}</i-button>
        <i-button @click="showAction('continue')" style="width: 95px;">continue</i-button>        
      </div>
      <i-input style="width: 200px" placeholder="快捷键" v-model="shortcut_key" @keyup.s.native="doSomething('s')" @keyup.c.native="doSomething('c')" 
                                    @keyup.space.native="doSomething('space')" @keyup.left.native="doSomething('left')" @keyup.right.native="doSomething('right')"
                                    @keyup.up.native="doSomething('up')" @keyup.down.native="doSomething('down')"/>
    </div>
    <div ref="data_source" style="display: none;">
      他需要来这么早吗
      他们需要填表吗
      我需要来吗
      他需要这么做吗
      你不需要再做它了
      你不需要来
      他不需要知道
      你不需要买这些东西
      他需要知道这些
      你们需要每天学习
      我们需要买很多东西
      我们需要告诉他
      你的头发需要洗了
      这桌子需要喷漆了
      你的房子需要装修了
      你的作业需要做了
    </div>
  </div>
</template>
<script>
  import ISelect from "iview/src/components/select/select";
  import IOption from "iview/src/components/select/option";

export default {
  components: {
    IOption,
    ISelect
  },
  data() {
    return {
      model: 1,
      percentage: "",
      show_text: "",
      button_text: "start",
      timer: null,
      interval_second: 5,
      value: 0,
      data_source: [],
      interval_line: 4,
      every_line_show_times: 3,      
      pause_points: [],
      sections: [],
      sections_selected: null,
      shortcut_key: "",
      is_lock: false,
      is_start: false,
    };
  },
  mounted() {
    const innerText = this.$refs.data_source.innerText;
    let text_array = innerText.split("\n").filter((t) => {
      return !junming.IsNullOrEmpty(t.trim());
    });
    const for_length = Math.ceil(text_array.length / this.interval_line);
    const latest_data = [];

    console.log(text_array);
    if (this.model === 1) {
      for (let i = 0; i < for_length; i++) {
        const current_index = i * this.interval_line;
        let current_no = current_index + this.interval_line;
        current_no =
          current_no > text_array.length ? text_array.length : current_no;

        for (let hh = 0; hh < this.every_line_show_times; hh++) {
          for (let j = current_index; j < current_no; j++) {
            console.log(j);
            latest_data.push(text_array[j]);
          }
        }
        this.pause_points.push(latest_data.length - 1);
        this.sections.push({value: i, text: "第"+ (i + 1) +"段"});
      }
    } else {
      for (let i = 0; i < for_length; i++) {
        const current_index = i * this.interval_line;
        let current_no = current_index + this.interval_line;
        current_no =
          current_no > text_array.length ? text_array.length : current_no;
        let last_data = "";
        for (let hh = 0; hh < this.every_line_show_times; hh++) {          
          if(hh > 0){
            latest_data.push(last_data);
          }
          for (let j = current_index; j < current_no; j++) {
            let before = j - 1;
            let after = j + 1;
            if (before !== current_index - 1) {
              latest_data.push(text_array[before].trim());
            }
            if (after >= current_no) {
              after = current_index;
            }
            last_data = text_array[j].trim();
            latest_data.push(last_data);
            latest_data.push(text_array[after].trim());
          }
        }
        latest_data.push(last_data);
        this.pause_points.push(latest_data.length - 1);
        this.sections.push({value: i, text: "第"+ (i + 1) +"段"});
      }
    }
    console.log(latest_data);
    console.log(this.pause_points);
    this.data_source = latest_data;
    this.sections_selected = 0;
    this.set_show_text(0);
  },
  methods: {
    get() {
      let current_value = this.value;
      let is_pause = false;
      this.pause_points.forEach((element) => {
        if (element == current_value) {
          is_pause = true;
        }
      });
      if (is_pause) {
        this.showAction("pause");
      }
      if (!this.sync_lock) {
        this.set_show_text(current_value + 1);    
      }
    },
    doSomething(key_word) {
      if(key_word == "s") {
        this.showAction("start");
      } else if(key_word == "c") {
        this.showAction("continue");
      } else if(key_word == "space") {
        this.showAction("pause");
      } else if (key_word == "left") {      
        if (this.is_start == true) {    
          this.showAction("pause");
          this.set_show_text(this.value - 1);                        
          this.showAction("continue");
        } else {
          this.set_show_text(this.value - 1);   
        }
      } else if (key_word == "right") {                
         if (this.is_start == true) {    
          this.showAction("pause");
          this.set_show_text(this.value + 1);                        
          this.showAction("continue");
        } else {
          this.set_show_text(this.value + 1);   
        }
      }
      this.shortcut_key = "";
    },
    set_show_text(current_value) {
      // is_timer = (is_timer == undefined ? false : is_timer);      
      if(this.data_source == null || this.data_source.length == 0) {
        return;
      }
      if (current_value < 0){
        current_value = 0;
      } else if (current_value > this.data_source.length - 1){
        current_value = this.data_source.length - 1;
      }     
      this.value = current_value;
      this.setter_section();
      this.show_text = this.data_source[current_value];
      this.percentage =
        ((current_value / (this.data_source.length - 1)) * 100).toFixed() + " %";        
    },
    showAction(name) {
      if (name === "start") {
        this.is_lock = false;        
        if(this.sections_selected == 0) {
            this.value = 0
        } else {
           this.value = this.pause_points[this.sections_selected - 1] + 1;
        }
        this.timer = setInterval(this.get, this.interval_second * 1000);
        this.button_text = "pause";
        this.is_start = true;
      } else if (name === "pause") {
        this.is_start = false;
        this.is_lock = true;        
        clearInterval(this.timer);
        this.button_text = "start";        
      } else if (name === 'continue') {
           this.is_lock = false;        
           if (this.button_text == "start") {                      
            this.timer = setInterval(this.get, this.interval_second * 1000);
            this.button_text = "pause";
            this.is_start = true;
          }
      }
    },
    setter_section() {
      let current_section = 0;
      for (let i = 0; i < this.pause_points.length; i++) {
          if(this.value <= this.pause_points[i]) {
              current_section = i;
              break;
          }
      }
      this.sections_selected = current_section;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
body {
  background-color: #2c3e50;
}
</style>
