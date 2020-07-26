<template>
  <div style="font-family: 微软雅黑; font-size: 30px; color: #87e8de;">
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
    </div>
    <div ref="data_source" style="display: none;">
      
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
      percentage: "",
      show_text: "",
      button_text: "start",
      timer: null,
      interval_second: 5,
      value: 0,
      data_source: [],
      interval_line: 5,
      every_line_show_times: 3,
      model: 1,
      pause_points: [],
      sections: [],
      sections_selected: null
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
        for (let hh = 0; hh < this.every_line_show_times; hh++) {
          for (let j = current_index; j < current_no; j++) {
            let before = j - 1;
            let after = j + 1;
            if (before !== current_index - 1) {
              console.log(before);
              latest_data.push(text_array[before].trim());
            }
            console.log(j);
            if (after >= current_no) {
              after = current_index;
            }
            console.log(after);
            latest_data.push(text_array[j].trim());
            latest_data.push(text_array[after].trim());
          }
        }
        this.pause_points.push(latest_data.length - 1);
        this.sections.push({value: i, text: "第"+ (i + 1) +"段"});
      }
    }
    console.log(latest_data);
    console.log(this.pause_points);
    this.data_source = latest_data;
    this.sections_selected = 0;
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
      this.percentage =
        ((this.value / (this.data_source.length - 1)) * 100).toFixed() + " %";
      this.show_text = this.data_source[this.value];
      this.value++;
      if (this.value >= this.data_source.length) {
        this.value = 0;
      }
    },
    showAction(name) {
      if (name === "start") {
        if(this.sections_selected == 0) {
            this.value = 0
        } else {
           this.value = this.pause_points[this.sections_selected - 1] + 1;
        }
        this.timer = setInterval(this.get, this.interval_second * 1000);
        this.button_text = "pause";
      } else if (name === "pause") {
        clearInterval(this.timer);
        this.button_text = "start";      
      } else if (name === 'continue') {
           if (this.button_text == "start") {          
            let current_section = 0;
            for (let i = 0; i < this.pause_points.length; i++) {
                if(this.value <= this.pause_points[i]) {
                    current_section = i;
                    break;
                }
            }
            this.sections_selected = current_section;
            this.timer = setInterval(this.get, this.interval_second * 1000);
            this.button_text = "pause";
          }
      }
    },
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
