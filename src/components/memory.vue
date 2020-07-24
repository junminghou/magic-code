<template>
  <div style="background-color: #2c3e50; height: 800px;">
    <div>
      <i-button @click="showAction(button_text)">{{button_text}}</i-button>
    </div>
    <div style="font-family: 微软雅黑; font-size: 20px; color: #87e8de; top: 40%; left: 40%; position: absolute;">
      {{show_text}}
    </div>
    <div ref="data_source" style="display: none;">
      111111111111111111111111
      2222222222222222222222222222
      333333333333333333333333333333
      444444444444444444444
      5555555555555555555555555
      66666666666666666666666
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show_text: "",
        button_text: "start",
        timer: null,
        value: 0,
        data_source: [],
        interval_line: 4,
        every_line_show_times: 5,
        model: 2
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
          current_no = (current_no > text_array.length ? text_array.length : current_no);

          for (let hh = 0; hh < this.every_line_show_times; hh++) {
            for (let j = current_index; j < current_no; j++) {
              console.log(j);
              latest_data.push(text_array[j]);
            }
          }
          latest_data.push("是否继续");
          console.log('---------------------')
        }
      } else {
        for (let i = 0; i < for_length; i++) {
          const current_index = i * this.interval_line;
          let current_no = current_index + this.interval_line;
          current_no = (current_no > text_array.length ? text_array.length : current_no);
          for (let hh = 0; hh < this.every_line_show_times; hh++) {
            for (let j = current_index; j < current_no; j++) {
              let before = j - 1;
              let after = j + 1;
              if (before !== (current_index - 1)) {
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
              //console.log('AAAAAAAAAAAAAAAAAAAAAA')
            }
          }
          latest_data.push("是否继续");
        }
      }
      console.log(latest_data)
      this.data_source = latest_data;
    },
    methods: {
      get() {
        if (this.value >= this.data_source.length) {
          this.showAction("pause");
          this.value = 0;
        } else {
          this.show_text = this.data_source[this.value];
          this.value++;
          console.log(this.value)
        }
      },
      showAction(name) {
        if (name === 'start') {
          this.timer = setInterval(this.get, 3000);
          this.button_text = "pause"
        } else if (name === 'pause') {
          clearInterval(this.timer);
          this.button_text = "start"
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>
<style>
  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
</style>
