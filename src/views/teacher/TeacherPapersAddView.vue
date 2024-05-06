<template>
  <div style="width: 100%">
    <div class="navbar-brand">
      <a class="navbar-item" @click="mode = 'list'" style="margin: 10px">
        <b-icon icon="chevron-left" style="margin-right: 5px"> </b-icon>
        <p style="font-weight: 800">返回</p>
      </a>
    </div>
    <div class="content" style="margin-left: 20px; margin-right: 20px">
      <b-input placeholder="标题" v-model="newExam.title"> </b-input>
      <b-input
        placeholder="序言"
        v-model="newExam.introduction"
        style="margin-top: 10px"
      >
      </b-input>
      <div style="display: flex; padding: 20px">
        <b-datetimepicker
          horizontal-time-picker
          placeholder="考试开始时间"
          v-model="newExam.startTime"
          :editable="true"
        ></b-datetimepicker>
        <b-icon icon="tilde" style="padding: 20px"></b-icon>
        <b-datetimepicker
          horizontal-time-picker
          placeholder="考试结束时间"
          :editable="true"
          v-model="newExam.endTime"
        ></b-datetimepicker>
      </div>
      <section>
        <b-table :data="questionsInNewExam">
          <b-table-column label="题号" centered v-slot="{ index }">
            <div style="font-size: larger">{{ index + 1 }}</div>
          </b-table-column>

          <b-table-column label="题型" centered v-slot="props">
            <span class="tag" :class="type(props.row.questionType)">
              {{ ["单选", "多选", "填空"][props.row.questionType] }}
            </span>
          </b-table-column>

          <b-table-column label="预览" centered width="500" v-slot="props">
            {{ props.row.content | truncate(80) }}
          </b-table-column>

          <b-table-column
            :label="'分值（总分：' + addTotalScore + '）'"
            centered
            v-slot="props"
          >
            <b-numberinput
              v-model="props.row.score"
              controls-position="compact"
              @input="
                addTotalScore = questionsInNewExam.reduce(function (
                  acc,
                  current
                ) {
                  return acc + current.score;
                },
                0)
              "
              min="0"
            ></b-numberinput>
          </b-table-column>

          <b-table-column v-slot="{ index }" label="删除" centered>
            <b-button
              rounded
              type="is-danger is-light"
              icon-left="close"
              @click="questionsInNewExam.splice(index, 1)"
            ></b-button>
          </b-table-column>
          <b-table-column v-slot="{ index }" label="移动" centered>
            <span
              ><b-button
                rounded
                icon-left="chevron-double-up"
                v-if="index !== 0"
                @click="
                  var questionToMoveTop = questionsInNewExam[index];
                  questionsInNewExam.splice(index, 1);
                  questionsInNewExam.unshift(questionToMoveTop);
                "
              >
              </b-button
              ><b-button rounded disabled icon-left="chevron-double-up" v-else>
              </b-button
            ></span>
            <span
              ><b-button
                rounded
                icon-left="chevron-up"
                v-if="index !== 0"
                @click="swapQuestion(index, index - 1)"
              >
              </b-button>
              <b-button
                disabled
                rounded
                icon-left="chevron-up"
                v-else
              ></b-button
            ></span>
            <span
              ><b-button
                rounded
                icon-left="chevron-down"
                v-if="index !== questionsInNewExam.length - 1"
                @click="swapQuestion(index, index + 1)"
              >
              </b-button
              ><b-button
                disabled
                rounded
                icon-left="chevron-down"
                v-else
              ></b-button
            ></span>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">点击➕从题库中选择题目</div>
          </template>
        </b-table>
        <b-button
          type="is-primary"
          icon-left="plus"
          rounded
          @click="
            addModalActive = true;
            if (questions.length === 0) loadQuestions();
          "
        ></b-button>
      </section>
      <b-modal v-model="addModalActive" has-modal-card>
        <div class="modal-card" style="width: auto">
          <section class="modal-card-body">
            <b-table
              :data="questions"
              paginated
              :per-page="10"
              :narrowed="true"
            >
              <b-table-column
                :searchable="true"
                :numeric="true"
                field="questionId"
                label="题目 ID"
                width="80"
                sortable
                v-slot="props"
              >
                <span class="questionId">
                  {{ props.row.questionId }}
                </span>
              </b-table-column>
              <b-table-column
                field="questionType"
                label="题型"
                sortable
                v-slot="props"
              >
                <span class="tag" :class="type(props.row.questionType)">
                  {{ ["单选", "多选", "填空"][props.row.questionType] }}
                </span>
              </b-table-column>

              <b-table-column
                :searchable="true"
                field="content"
                label="预览"
                width="500"
                v-slot="props"
              >
                {{ props.row.content | truncate(80) }}
              </b-table-column>

              <b-table-column label="选择此题" v-slot="props" centered>
                <b-button
                  class="button is-success is-small"
                  icon-left="plus-thick"
                  rounded
                  @click="
                    let questionToAdd = props.row;
                    questionToAdd.score = 0;
                    questionsInNewExam.push(questionToAdd);
                    addModalActive = false;
                  "
                  style="margin-right: 10px; height: 25.8px"
                >
                </b-button>
              </b-table-column>
              <template #empty>
                <div class="has-text-centered">
                  暂无题目，您可以前往「题库」贡献题目
                </div>
              </template>
            </b-table>
          </section>
        </div>
      </b-modal>
    </div>
    <b-button
      type="is-success"
      outlined
      icon-left="check-bold"
      style="margin-bottom: 30px"
      @click="addSave"
    >
      <strong>保存</strong>
    </b-button>
  </div>
</template>

<script>
export default {
  props: ["mode"],
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
};
</script>
