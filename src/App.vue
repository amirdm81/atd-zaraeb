<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h2>ضرایب</h2>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container>
      <v-main>
        <v-row>
          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="12">
                <v-text-field label="مبلغ" v-model.number="price" />
              </v-col>

              <v-col cols="6">
                <v-select
                  :items="zaraeb"
                  v-model="fromYear"
                  label="از سال"
                  item-text="year"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="toYearZaraeb"
                  :disabled="!fromYear"
                  v-model="toYear"
                  label="تا سال"
                  item-text="year"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field label="رقم اعشار (پیشفرض 3)" v-model="fix" />
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="6">
                    <v-btn
                      color="success"
                      :disabled="!fromYear || !toYear || !price"
                      block
                      @click="calculate"
                      >محاسبه</v-btn
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      color="error"
                      block
                      @click="clear"
                      :disabled="!result"
                      >پاک کردن</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" v-if="result">
                <p>امتیاز : {{ result.score }}</p>
                <p>مبلغ نهایی : {{ result.price.toLocaleString() }}</p>
                <p>ضریب : {{ result.z }}</p>
              </v-col>
            </v-row>
          </v-col>

          <!-- <v-col cols="12" lg="6">
            <Score />
          </v-col> -->

          <v-col cols="12" lg="6">
            <div class="d-flex justify-space-between">
              <h2>جدول ضرایب</h2>
              <div class="d-flex">
                <v-btn small color="primary" @click="download" class="mx-1">دانلود ضرایب</v-btn>
              </div>

              
            </div>

            <v-data-table
              :items="zaraeb"
              :headers="header"
              hide-default-footer
              no-data-text="هیچ ضریبی وجود ندارد"
              :items-per-page="16"
            >
            </v-data-table>
          </v-col>
        </v-row>
      </v-main>
    </v-container>
     <v-footer padless>
    <v-col
      class="text-center"
      cols="12"
    >
      {{ new Date().getFullYear() }} — نسخه 0.0.2 — <strong>طراحی شده توسط امیر رضا :)</strong>
    </v-col>
  </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "App",
    data: () => ({
        header: [
            { value: "year", text: "سال" },
            { value: "z", text: "ضریب" },
            { value: "action", text: "" },
        ],
        fromYear: "",
        toYear: "",
        price: "",
        toYearZaraeb: [],
        result: null,
        fix: null,
        addNew: false,
        year: "",
        z: "",
    }),
    computed: {
        ...mapState(["zaraeb"]),
    },
    watch: {
        fromYear() {
            this.toYearZaraeb = this.zaraeb.filter((z) => z.year >= this.fromYear);
        },
    },
    methods: {
        calculate() {
            let z;
            const bazeh = this.zaraeb
                .map((z) => {
                if (z.year >= this.fromYear && z.year <= this.toYear) {
                    return z;
                }
            })
                .filter((z) => z != undefined);
            if (bazeh.length > 1) {
                z = (bazeh.reduce((p, c) => {
                    if (typeof p == "number") {
                        return p + c.z;
                    }
                    else {
                        return p.z + c.z;
                    }
                }) / bazeh.length).toFixed(this.fix || 3);
            }
            else {
                z = bazeh[0].z;
            }
            // calculate score of this
            let score = 0
            const currentYear = 1402
            console.log(((this.fromYear + this.toYear) / 2))
            const p = (currentYear - ((this.fromYear + this.toYear) / 2)).toFixed(3)
            console.log(Math.pow(1.2, p))
            score = (0.03 * Math.pow(1.2, p) * this.price) * 2.79769559
            console.log(score)
            this.result = {
                z,
                score,
                price: ((this.price * z) * 1.00396865),
            };
        },
        clear() {
            this.fromYear = "";
            this.toYear = "";
            this.result = null;
            this.fix = null;
            this.price = null;
            this.toYearZaraeb = [];
        },
        add() {
            this.$store.commit("add", { year: this.year, z: this.z });
            this.year = "";
            this.z = "";
            this.addNew = false;
        },
        remove(year) {
            this.$store.commit("remove", year);
        },
        download() {
            fetch("https://amirdm81.github.io/atd/data.json").then((data) => data.json()).then(({ data }) => {
                this.$store.commit("import", data);
            }).catch(e => {
                console.log(e);
            });
        },
    },
};
</script>
