<template>
  <div id="app">
    <div class="input_file">
      <div class="chooseFile">
            <button class="btn" @click="triggerFileInput">local
                <span></span><span></span><span></span><span></span>
            </button>
            <div id="fileName">{{ fileName || '檔名' }}</div>
            <input type="file" ref="fileInput" @change="handleFileChange" accept=".csv" style="display: none;">
        </div>
    </div>
    
    <div class="sheet">
      <table id="dataTable">
        <tr v-for="(row, index) in displayData" :key="index">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
        </tr>
      </table>
    </div>

    <div>
      <span>請輸入要分析的筆數</span>
      <input type="number" class="nums" v-model="numEntries" placeholder="請輸入數字">
    </div>
    <button class="btn2" @click="analyzeData">Analysis</button>

    <div v-if="predictions.length > 0">
      <h3>分析結果</h3>
      <ul>
        <li v-for="(prediction, index) in predictions" :key="index">{{ prediction }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      fileName: '',
      csvData: [],
      numEntries: null,
      predictions: []
    };
  },
  computed: {
    displayData() {
      if (this.numEntries) {
        return this.csvData.slice(0, this.numEntries);
      }
      return this.csvData;
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          this.csvData = this.parseCSV(content);
        };
        reader.readAsText(file);
      }
    },
    parseCSV(text) {
      return text.split('\n').map(row => row.split(','));
    },
    analyzeData() {
      const numEntries = parseInt(this.numEntries);
      if (isNaN(numEntries) || numEntries <= 0) {
        alert('請輸入有效的數字');
        return;
      }

      const dataToAnalyze = this.csvData.slice(0, numEntries);

      axios.post('/analyze', { data: dataToAnalyze })
        .then(response => {
          this.predictions = response.data.predictions;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
};
</script>

<style>
.app {
    margin: 20px;
    background-color: aliceblue;
}
button {
    margin: 10px 0;
    padding: 5px 10px;
}
#fileInput {
    display: none;
}
.sheet {
    margin-top: 20px;
    border-collapse: collapse;
}
.sheet th, .sheet td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
.sheet th {
    background-color: #f2f2f2;
}

#nums {
    width: 80px;
}

/* 按鈕(Local) + (檔名) */
.chooseFile {
    display: flex;
    align-items: center;
}
.chooseFile #fileName {
    padding-left: 5%;
}

.btn {
    display: inline-block;
    position: relative;
    z-index: 1;
    min-width: 200px;
    background: #FFFFFF;
    border: 2px solid goldenrod;
    border-radius: 4px;
    color: goldenrod;
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    overflow: hidden;
    transition: 0.5s;
    padding: 10px 20px;
}
.btn span {
    position: absolute;
    width: 25%;
    height: 100%;
    background-color: goldenrod;
    transform: translateY(150%);
    border-radius: 50%;
    left: calc((var(--n) - 1) * 25%);
    transition: 0.5s;
    transition-delay: calc((var(--n) - 1) * 0.1s);
    z-index: -1;
}
.btn:hover,
.btn:focus {
    color: black;
}
.btn:hover span {
    transform: translateY(0) scale(2);
}
.btn span:nth-child(1) {
    --n: 1;
}
.btn span:nth-child(2) {
    --n: 2;
}
.btn span:nth-child(3) {
    --n: 3;
}
.btn span:nth-child(4) {
    --n: 4;
}


/* ANALYSIS 的變化 */
.btn2,
.btn2:focus {
    position: relative;
    min-width: 200px;
    background: transparent;
    color: #E1332D;
    font-size: 1rem;
    text-align: center;
    text-transform: uppercase;
    text-decoration: none;
    box-sizing: inherit;
    padding: 10px 20px;
    border: 1px solid;
    box-shadow: inset 0 0 20px rgba(225, 51, 45, 0);
    outline: 1px solid !important;
    outline-color: rgba(225, 51, 45, 0.5);
    outline-offset: 0px;
    text-shadow: none;
    transition: all 1250ms cubic-bezier(0.19, 1, 0.22, 1);
}
.btn2:hover {
    color: #E1332D;
    border: 1px solid;
    box-shadow: inset 0 0 20px rgba(225, 51, 45, 0.5), 0 0 20px rgba(225, 51, 45, 0.2);
    outline: 1px solid !important;
    outline-color: rgba(225, 51, 45, 0) !important;
    outline-offset: 15px;
    text-shadow: 1px 1px 2px #427388;
}
</style>