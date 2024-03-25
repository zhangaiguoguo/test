<template>
    <div class="el-dialog-record-func-div-box" @paste.stop="()=>{}">
        <el-dialog modal-class="el-dialog-record-func-div" v-model="circularAreaVisible" title="设置循环区域"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 100%;justify-content: center;">
                <el-form ref="circularAreaFormRef" style="width:85%;" :model="circularAreaForm"
                         :rules="circularAreaFormRules">
                    <el-form-item label="区域范围:" prop="range">
                        <el-input placeholder="区域范围" v-model="circularAreaForm.range" @input="rangeInputHandler">
                            <template #append>
                                <ElIcon title="通过视图框选"
                                        :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen ? '#409EFF' : '' }"
                                        @click="rangeBoxSelectionOpen = !rangeBoxSelectionOpen">
                                    <Position />
                                </ElIcon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="循环级别:" prop="loopLevel">
                        <el-select-package :options="loopLevelOption" clearable placeholder="区域范围"
                                           v-model="circularAreaForm.loopLevel" />
                    </el-form-item>
                    <el-form-item label="区域名称:" prop="circularAreaName">
                        <el-input placeholder="区域名称" v-model="circularAreaForm.circularAreaName" />
                    </el-form-item>
                    <el-row>
                        <el-alert title="特别提示" type="warning" :description="circularAreaFormAlertValue" show-icon
                                  :closable="false" />
                    </el-row>
                </el-form>
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="circularAreaSubmit">提交</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="setReturnValueVisible" title="设置返回区域"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 100%;justify-content: center;">
                <el-form ref="setReturnValueFormRef" style="width:85%;" :model="setReturnValueForm"
                         :rules="setReturnValueFormRules" label-position="right" label-width="85px">
                    <el-form-item label="单元格:" prop="range">
                        <el-input placeholder="单元格" v-model="setReturnValueForm.range" @input="rangeInputHandler">
                            <template #append>
                                <ElIcon title="通过视图框选"
                                        :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen ? '#409EFF' : '' }"
                                        @click="rangeBoxSelectionOpen = !rangeBoxSelectionOpen">
                                    <Position />
                                </ElIcon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="返回值类型:" prop="returnType">
                        <el-select-package clearable placeholder="返回值类型" v-model="setReturnValueForm.returnType"
                                           :options="returnTypeOption" />
                    </el-form-item>
                    <el-form-item label="计算类型:" prop="calculationType">
                        <el-select-package :options="calculationTypeOption" clearable placeholder="计算类型"
                                           v-model="setReturnValueForm.calculationType" />
                    </el-form-item>
                    <el-form-item label="计算单元格:" prop="calculateCells"
                                  v-if="setReturnValueForm.calculationType==='计算平均值'">
                        <el-input placeholder="计算单元格" v-model="setReturnValueForm.calculateCells">
                            <template #append>
                                <ElIcon title="通过视图框选"
                                        :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen2 ? '#409EFF' : '' }"
                                        @click="rangeHook((v)=>setReturnValueForm.calculateCells = v)">
                                    <Position />
                                </ElIcon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-row>
                        <el-alert title="特别提示" type="warning" :description="setReturnValueFormAlterValue" show-icon
                                  :closable="false" />
                    </el-row>
                </el-form>
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="setReturnSubmit">提交</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="setRoundingVisible" title="设置数值修约"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 100%;justify-content: center;">
                <el-form ref="setRoundingFormRef" style="width:95%;" :model="setRoundingForm"
                         :rules="setRoundingFormRules||[]">
                    <el-form-item label="单元格:" prop="range">
                        <el-input @input="rangeInputHandler" placeholder="单元格" v-model="setRoundingForm.range">
                            <template #append>
                                <ElIcon title="通过视图框选"
                                        :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen ? '#409EFF' : '' }"
                                        @click="rangeBoxSelectionOpen = !rangeBoxSelectionOpen">
                                    <Position />
                                </ElIcon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="" prop="list">
                        <div style="width:100%;">
                            <label>已设置规则:</label>
                            <el-table :data="setRoundingForm.list" border script>
                                <el-table-column width="120" prop="roundingCondition" label="修约条件" align="center"
                                                 show-overflow-tooltip />
                                <el-table-column prop="rulesForRounding" label="修约规则" align="center"
                                                 show-overflow-tooltip
                                                 width="180" />
                                <el-table-column prop="reservedDigits" label="保留位数" align="center"
                                                 show-overflow-tooltip />
                                <el-table-column label="操作" width="120" fixed="right" align="center">
                                    <template #default="{ row }">
                                        <el-button style="font-size:13px;" type="danger" link icon="Delete"
                                                   @click="() => { setRoundingForm.list = setRoundingForm.list.filter(item => item.uuid !== row.uuid) }">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-form-item>
                    <el-form-item label="修约条件:" style="width:85%;">
                        <el-row style="flex-wrap:nowrap;justify-content:space-between;">
                            <span style="margin-right:1%;">数值</span>
                            <el-form-item style="width:40%;" label="" prop="roundingConditionSymbol">
                                <el-select-package clearable placeholder="符号"
                                                   v-model="setRoundingForm.roundingConditionSymbol"
                                                   :options="roundingConditionSymbolOptions||[]" />
                            </el-form-item>
                            <el-form-item style="width:34%;" label="" prop="roundingConditionNum">
                                <el-input-number :min="0" placeholder="值"
                                                 v-model="setRoundingForm.roundingConditionNum"
                                                 controls-position="right" />
                            </el-form-item>
                            <span>时</span>
                        </el-row>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="修约方式:" prop="rulesForRounding">
                                <el-select-package clearable placeholder="修约方式"
                                                   v-model="setRoundingForm.rulesForRounding"
                                                   :options="rulesForRoundingOptions||[]" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="保留方式:" prop="retentionMethod">
                                <el-select-package clearable placeholder="保留方式"
                                                   v-model="setRoundingForm.retentionMethod"
                                                   :options="retentionMethodOptions||[]" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 12px">
                        <el-col :span="12">
                            <el-form-item label="保留位数:" prop="reservedDigits">
                                <el-input-number controls-position="right" :min="0" placeholder="保留位数"
                                                 v-model="setRoundingForm.reservedDigits" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="科学计数法:" prop="scientificNotation">
                                <el-select-package clearable placeholder="科学计数法"
                                                   v-model="setRoundingForm.scientificNotation"
                                                   :options="scientificNotationOptions||[]" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" plain @click="addAmendmentRules">新增</el-button>
                    <el-button type="primary" @click="setRoundingSubmit">提交</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="setFillContent" title="设置填充内容" :modal="false"
                   draggable
                   :append-to-body="false" size="100%">

            <el-scrollbar style="width: 100%;height:50vh;overflow: auto;">
                <el-input v-model="setFillContentSearchValue" placeholder="请输入关键字">
                    <template #prepend>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
                <el-row @drag.stop="" style="justify-content: flex-start;overflow: hidden">
                    <el-tree ref="setFillContentRef" style="margin-top:20px;width: 100%;"
                             :data="setFillContentList" :props="setFillContentProps" accordion
                             :filter-node-method="setFillContentSearchFilterNode">
                        <template #default="{ node, data }">
                            <el-col style="user-select: none;" draggable="true" @dragend="setFillContentNodeDragEnd"
                                    @dragstart="setFillContentNodeDragStart(node)">{{ node.label }}
                            </el-col>
                        </template>
                    </el-tree>
                </el-row>
            </el-scrollbar>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="rangeBoxSelectionOpen" title="选取数据范围"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 80%;justify-content: center;margin:0 auto;" v-if="rangeBoxSelectionOptions">
                <el-input placeholder="数据范围" v-model="rangeBoxSelectionOptions.range" />
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="rangeBoxSelectionSubmit">确认</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="rangeBoxSelectionOpen2" title="选取数据范围"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 80%;justify-content: center;margin:0 auto;" v-if="rangeBoxSelectionOptions2">
                <el-input placeholder="数据范围" v-model="rangeBoxSelectionOptions2.range" />
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="rangeBoxSelectionSubmit2">确认</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="returnTypeAreaVisible" title="设置区域类型"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 100%;justify-content: center;">
                <el-form ref="returnTypeAreaFormRef" style="width:95%;" :model="returnTypeAreaForm"
                         :rules="returnTypeAreaFormRules" label-width="80px" label-position="right">
                    <el-form-item label="单元格:" prop="range">
                        <el-input @input="rangeInputHandler" placeholder="单元格" v-model="returnTypeAreaForm.range">
                            <template #append>
                                <el-icon title="通过视图框选"
                                         :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen ? '#409EFF' : '' }"
                                         @click="rangeBoxSelectionOpen = !rangeBoxSelectionOpen">
                                    <Position />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="类型区域" prop="typeArea">
                        <el-select-package v-model="returnTypeAreaForm.typeArea"
                                           :options="returnTypeAreaFormTypeAreaOptionsProxy" />
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-alert title="特别提示" type="warning" :description="returnTypeareaFormAlterValue" show-icon
                              :closable="false" />
                </el-row>
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="returnTypeAreaSubmit">提交</el-button>
                </el-row>
            </template>
        </el-dialog>
        <el-dialog modal-class="el-dialog-record-func-div" v-model="setCellDropdownVisible" title="设置单元格下拉"
                   :modal="false"
                   draggable :append-to-body="false">
            <el-row style="width: 100%;justify-content: center;">
                <el-form ref="setCellDropdownFormRef" style="width:85%;" :model="setCellDropdownForm"
                         :rules="setCellDropdownFormRules" label-position="right" label-width="85px">
                    <el-form-item label="单元格:" prop="range">
                        <el-input placeholder="单元格" v-model="setCellDropdownForm.range" @input="rangeInputHandler">
                            <template #append>
                                <ElIcon title="通过视图框选"
                                        :style="{ cursor: 'pointer', color: rangeBoxSelectionOpen ? '#409EFF' : '' }"
                                        @click="rangeBoxSelectionOpen = !rangeBoxSelectionOpen">
                                    <Position />
                                </ElIcon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="下拉名称:" prop="name">
                        <el-input clearable placeholder="下拉名称" v-model="setCellDropdownForm.name" />
                    </el-form-item>
                    <el-form-item>
                        <el-row style="flex-wrap: wrap;width: 100%">
                            <el-col>
                                <ul style="margin-top:-6px;">
                                    <li v-for="(item,index) in setCellDropdownForm.options" style="margin-top:6px;">
                                        <el-row :gutter="6">
                                            <el-col :span="16">
                                                <el-input v-model="item.value" clearable />
                                            </el-col>
                                            <el-col :span="4">
                                                <el-row align="bottom" style="height: 100%;">
                                                    <el-button type="danger"
                                                               @click="setCellDropdownForm.options.splice(index,1)">删除
                                                    </el-button>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </li>
                                </ul>
                            </el-col>
                            <el-col style="margin-top: 6px;">
                                <el-row :gutter="6">
                                    <el-col :span="16">
                                        <el-input placeholder=" "
                                                  v-model="setCellDropdownForm.addValue" clearable />
                                    </el-col>
                                    <el-col :span="4">
                                        <el-button type="primary" @click="setCellDropdownFormOptionsAddOpiton">
                                            新增
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-row>
            <template #footer>
                <el-row style="justify-content: flex-end;">
                    <el-button type="primary" @click="setCellDropdownFormSubmit">提交</el-button>
                </el-row>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import {
    $$deepClone,
    $$parse,
    $$stringify,
    generateAlphabeticalSort,
    generatedArray,
    letterGeneratedNumber,
    parseLetterCoordinates,
    rangeToWordStr,
} from "@/utils/commonUtils";
import { computed, getCurrentInstance, nextTick, onUnmounted, reactive, ref, watch } from "vue";
import {
    calculationTypeOptionHook,
    circularAreaFormRulesHook,
    loopLevelOptionHook,
    retentionMethodOptionsHook,
    returnTypeareaFormRulesHook,
    returnTypeAreaFormTypeAreaOptions,
    returnTypeOptionHook,
    roundingConditionSymbolOptionsHook,
    rulesForRoundingOptionsHook,
    scientificNotationOptionsHook,
    setRoundingFormRulesHook,
} from "@/views/tool/luckysheet/components/alertWindow/options";
import { recordInfoKeyWorld } from "@/api/amodules/recordForm/recordInfo";
import { getActiveSheet, getSelectedsStatus } from "@/views/tool/luckysheet/tool";
import ElSelectPackage from "@/components/commont/ElSelectPackage.vue";
import { rangeTsInterface, rangeTsInterface_ } from "@/views/tool/luckysheet/tsJS";
import filedStore from "@/store/modules/filedStore";
import $filedStore from "@/store/modules/filedStore";
import pubsub from "@/views/tool/luckysheet/pubsub";

const { proxy }: any = getCurrentInstance();
const props: any = defineProps<{
    hooks: object
}>();

const setCellDropdownVisible: any = ref(false);

const setCellDropdownForm: any = ref({});

const setCellDropdownFormRef: any = ref({});

const setCellDropdownFormRules: any = ref<any>({
    range: [{ required: true, message: "单元格必选" }],
    name: [{ required: true, message: "名称必选" }],
});


watch(setCellDropdownVisible, (v: boolean) => {
    if (v) {
        setCellDropdownForm.value = {};
        rangeBoxSelectionOptions.value = {
            type: 1,
            info: setCellDropdownForm.value,
            is: () => setCellDropdownVisible.value,
        };
        nextTick(() => {
            if (!setCellDropdownForm.value.range) {
                _rangeBoxSelectionHandler(getActiveSheet().luckysheet_select_save, setCellDropdownForm);
            }
        });
    }
});

function setCellDropdownFormOptionsAddOpiton() {
    if (!setCellDropdownForm.value.options) {
        setCellDropdownForm.value.options = [];
    }
    setCellDropdownForm.value.options.push({
        label: setCellDropdownForm.value.addLable,
        value: setCellDropdownForm.value.addValue,
    });
    setCellDropdownForm.value.addLable = "";
    setCellDropdownForm.value.addValue = "";
}

const returnTypeAreaFormTypeAreaOptionsProxy = ref(returnTypeAreaFormTypeAreaOptions());
const returnTypeAreaVisible = ref(false);
const returnTypeAreaFormRef = ref();
const returnTypeAreaFormRules = ref(returnTypeareaFormRulesHook());
const returnTypeAreaForm: any = ref({});
const root: any = window;

function returnTypeAreaSubmit() {
    returnTypeAreaFormRef.value?.validate?.(function(v: boolean, residue: object) {
        if (v) {
            delReturnTypeAreaListItem(returnTypeAreaForm.value);
            const data: any = reactive({ ...returnTypeAreaForm.value, uuid: Date.now() });
            returnTypeAreaList.value.push(data);
            const toolHooks: any = luckysheetRef.value.getToolHooks();
            const circularAreaName = returnTypeAreaForm.value.typeArea;
            toolHooks.createRegion(returnTypeAreaForm.value.ranges, {
                type: "类型区域",
                id: data.uuid,
            }, !0).then((response: Function) => {
                data.info = response(circularAreaName);
            });
            returnTypeAreaForm.value = {};
            returnTypeAreaVisible.value = !!0;
            returnTypeAreaList.value = [...returnTypeAreaList.value];
            return !0;
        }
        proxy.$message({
            type: "error",
            message: "操作失败，有" + Object.keys(residue).length + "处选项未填",
        });
    });
}

watch(returnTypeAreaVisible, (v: boolean) => {
    if (v) {
        returnTypeAreaForm.value = {};
        rangeBoxSelectionOptions.value = {
            type: 1,
            info: returnTypeAreaForm.value,
            is: () => returnTypeAreaVisible.value,
        };
        nextTick(() => {
            if (!returnTypeAreaForm.value.range) {
                _rangeBoxSelectionHandler(getActiveSheet().luckysheet_select_save, returnTypeAreaForm);
            }
        });
    }
});

function delReturnTypeAreaListItem(row: { uuid?: number, info?: any }) {
    const sub = returnTypeAreaList.value.findIndex((item: { uuid: number }) => item.uuid === row.uuid);
    if (sub > -1) {
        returnTypeAreaList.value.splice(sub, 1);
        const toolHooks: any = luckysheetRef.value.getToolHooks();
        const [info, callback]: any[] = toolHooks.uuidGetReginsDel(row.info?.at?.(-1));
        callback?.();
    }
}

const luckysheetRef = computed(() => {
    return props.hooks;
});
const setFillContentSearchValue = ref<string>("");
const setFillContentRef: any = ref();
const setFillContent = ref<boolean>(!!0);

const setFillContentProps = {
    children: "children",
    label: "label",
};

const rangeBoxSelectionOpen2 = ref(false);
const rangeBoxSelectionOptions2: any = ref({});
const rangeBoxSelectionOptions2Callback: any = ref(null);


function rangeHook(callback: Function) {
    rangeBoxSelectionOpen2.value = !0;
    rangeBoxSelectionOptions2Callback.value = callback;
}

//提交luckysheet选中区域
watch(rangeBoxSelectionOpen2, v => {
    if (v) {
        function hook(v: any, v2: any) {
            if (v2 === 1 && rangeBoxSelectionOptions2.value.range) return;
            rangeBoxSelectionOptions2.value.range = v.map((item: rangeTsInterface) => _rangeBoxSelectionItemHandler(item));
            rangeBoxSelectionOptions2.value.ranges = v;
        }

        hook(getActiveSheet().luckysheet_select_save, 1);
        // rangeBoxSelectionOptions.value.info=
        luckysheetRef.value.getPubsub?.()?.$emit("add-lucky-sheet-select-cell-or-all-hooks", "add-lucky-sheet-select-cell-or-all-hooks-2", hook);
    } else {
        luckysheetRef.value.getPubsub?.()?.$emit?.("del-lucky-sheet-select-cell-or-all-hooks", "add-lucky-sheet-select-cell-or-all-hooks-2");
    }
});

function rangeBoxSelectionSubmit2() {
    rangeBoxSelectionOptions2Callback.value?.(rangeBoxSelectionOptions2.value.range);
    rangeBoxSelectionOptions2.value = {};
    rangeBoxSelectionOpen2.value = !1;
}

function setFillContentNodeDragStart(...args: any[]) {
    try {
        (args[0].data.value && luckysheetRef.value.getDragHandlers()[0]({}, {
            ...args[0].data,
            code: args[0].data.value,
            name: args[0].data.label,
        }));
    } catch (err) {
        proxy.$message({
            type: "wraning",
            message: "操作失败",
        });
    }
}

function setFillContentNodeDragEnd(...args: any[]) {
    luckysheetRef.value.getDragHandlers()[0]({});
    nextTick(() => {
        // setFillContentList.value = JSON.parse(JSON.stringify(setFillContentList_.value))
    });
}

function rangeInputHandler(evt: string) {
    let flag = !0;
    if (/^([a-z]+[\d]+)\:([a-z]+[\d]+)$/i.test(evt)) {
        const range = evt.split(":").map((item: string) => {
            const letter = item.replaceAll(/\d+/g, "");
            const num = item.replaceAll(/[^0-9]+/ig, "");
            const letterNum = letterGeneratedNumber(letter);
            return [letterNum, +num - 1];
        });
        const ranges: rangeTsInterface[] = [{
            row: [range[0][1], range[1][1]],
            column: [range[0][0] - 1, range[1][0] - 1],
        }];
        luckysheetRef.value?.getLuckysheet?.()?.setRangeShow(ranges);
        rangeBoxSelectionHandler(ranges);
        flag = !!0;
    }
    flag && proxy.$message({ type: "error", grouping: true, message: "操作失败，例如 B2:C3" });
}

const setFillContentList = ref<object[]>([]);
watch(setFillContentSearchValue, (val: string) => {
    setFillContentRef.value?.filter(val);
});
const setFillContentSearchFilterNode = (value: string, data: any) => {
    if (!value) return true;
    return data.label?.includes?.(value);
};
const setRoundingFormRef: any = ref();

function computedProxy(ref: string | number) {
    return {
        get() {
            depId.value;
            const config: any = (props.hooks.getActiveSheet(luckysheet.value) || {}).config;
            if (!config) return [];
            if (!config[ref]) {
                config[ref] = [];
            }
            return config[ref];
        },
        set(v: any) {
            depId.value++;
            const config: any = reactive((props.hooks.getActiveSheet(luckysheet.value) || {}).config);
            config[ref] = v;
        },
    };
}


const setRoundingList: any = computed(computedProxy("setRoundingList"));
const setRoundingVisible: any = ref<boolean>(!!0);
watch(setRoundingVisible, (v: boolean) => {
    if (v) {
        setRoundingForm.value = setRoundingFormInfo();
        rangeBoxSelectionOptions.value = {
            type: 1,
            info: setRoundingForm.value,
            is: () => setRoundingVisible.value,
        };
        nextTick(() => {
            if (!setRoundingForm.value.range) {
                _rangeBoxSelectionHandler(getActiveSheet().luckysheet_select_save, setRoundingForm);
            }
        });
    }
});

function setRoundingFormInfo(options?: object): object {
    return {
        range: "",
        rulesForRounding: "",
        reservedDigits: 0,
        roundingConditionSymbol: "",
        roundingConditionNum: 0,
        list: [],
        retentionMethod: "",
        scientificNotation: 0,
        ...(options || {}),
    };
}

const filesblacklist = ["blankWeightNumber"];

//通过luckysheet函数改变cell内容
function fillContentHook(fillContent: object[], callback?: Function) {
    const hooks: any = luckysheetRef.value.getLuckysheet();
    _fillContentHook(fillContent, {
        loop: (cellValue: any, value: object, _value: any, sheet?: any) => {
            Object.assign(cellValue.v, typeof callback === "function" ? callback(value, cellValue, _value) : value);
        },
        loopEnd() {
            setTimeout(() => {
                hooks.refresh({});
            }, 16);
        },
        filterCallback(v: any) {
            return !v.v._f_code_ref_loop;
        },
    });
}

//通过数据结构改变cell内容
function fillContentHookObject(fillContent: object[], sheet: any, callback?: Function) {
    _fillContentHook(fillContent, {
        loop: (cellValue: any, value: object) => {
            Object.assign(sheet.data[cellValue.r][cellValue.c], typeof callback === "function" ? callback(value, cellValue) : value);
        },
    }, sheet);
    return sheet;
}

const $$fieldStoreState = $filedStore();

//填充内容
function _fillContentHook(fillContent: object[], callbacks: {
    loop: Function,
    loopEnd?: Function,
    filterCallback?: Function
}, sheetInfo?: any) {
    const sheet: any = sheetInfo || (props.hooks.getActiveSheet(luckysheet.value) || {});
    const filedContent = {};
    fillContent.forEach((item: any) => {
        for (let w in item) {
            if (!Reflect.has(filedContent, w)) {
                filedContent[w] = "";
            }
            item[w] && Reflect.set(filedContent, w, Reflect.get(filedContent, w) + (Reflect.get(filedContent, w) && "、") + item[w]);
        }
    });
    findFields(sheet, callbacks.filterCallback).forEach((item: any) => {
        if (!Reflect.has(item.v, "_v_code_ref")) {
            Reflect.set(item.v, "_v_code_ref", item.v.m);
        }
        const cv = item.v.v + "";
        const nv = cv.replaceAll(/({[^{}]+})/mg, filedContent[item.v._f] || "/");
        const value = {
            m: nv,
            v: nv,
        };
        callbacks.loop(item, value, $$fieldStoreState.$findConvert(filedContent, item.v._f), sheet);
    });
    callbacks.loopEnd?.();

}

function findSheetCellData(sheet: any) {
    if (!sheet?.data) return [];
    const list = [];
    for (let w = 0; w < sheet.data.length; w++) {
        for (let i = 0; i < sheet.data[w].length; i++) {
            sheet.data[w][i] && list.push({ r: w, c: i, v: sheet.data[w][i] });
        }
    }
    return list;
}

function findFields(sheetInfo: any, callback?: Function) {
    const _callback: Function = typeof callback === "function" ? callback : () => !0;
    let cellData = (sheetInfo || props.hooks.getActiveSheet(luckysheet.value))?.celldata || [];
    if (!cellData.length) cellData = findSheetCellData(sheetInfo);
    const fieldList: object[] = [];
    for (let w = 0; w < cellData.length; w++) {
        if (filesblacklist.some((_item: any) => `{${_item}}` === cellData[w]?.v?.v_code)) continue;
        if (Reflect.has(cellData[w]?.v || {}, "v_code") && new RegExp(/^({).+(})$/).test(cellData[w]?.v.v_code)) {
            _callback(cellData[w]) && fieldList.push(cellData[w]);
        }
    }
    return fieldList;
}

const setRoundingForm: any = ref<object>(setRoundingFormInfo());
const setRoundingFormRules: any = ref<object>(setRoundingFormRulesHook());
const roundingConditionSymbolOptions: any = ref<object[]>(roundingConditionSymbolOptionsHook());
const rulesForRoundingOptions: any = ref<object[]>(rulesForRoundingOptionsHook());
const retentionMethodOptions: any = ref<object[]>(retentionMethodOptionsHook());

const scientificNotationOptions: any = ref<object[]>(scientificNotationOptionsHook());

const depId = computed({
    get() {
        return props.hooks.getVariableInfo().depsId;
    },
    set(v) {
        return props.hooks.getVariableInfo().depsId = v;
    },
});

//新增数值修约
function addAmendmentRules() {
    setRoundingFormRef.value.validate(function(validate: boolean, residue: object) {
        if (validate) {
            // roundingCondition rulesForRounding reservedDigits
            const form = setRoundingForm.value;
            const roundingCondition = "数值" + form.roundingConditionSymbol + form.roundingConditionNum + "时";
            const rulesForRounding = form.rulesForRounding + "," + form.retentionMethod + (!form.scientificNotation ? "" : ",科学计数法");
            form.list.push({
                roundingCondition,
                rulesForRounding,
                reservedDigits: form.reservedDigits,
                _info: { ...form, list: [] },
                uuid: Date.now(),
                range: form.range,
            });
            setRoundingForm.value = setRoundingFormInfo({ list: form.list, range: form.range });
            return !0;
        }
        proxy.$message({
            type: "error",
            message: "操作失败，有" + Object.keys(residue).length + "处选项未填",
        });
    });
}

//提交数值修约
function setRoundingSubmit() {
    const hooks = props.hooks.getLuckysheet();
    const sheet: any = props.hooks.getActiveSheet(luckysheet.value);
    const form: any = setRoundingForm.value;
    const _map: any = {};
    form.list.forEach((item: { range: string, _info: { ranges: object } }) => {
        if (!_map[item.range]) _map[item.range] = { range: item.range, ranges: item._info.ranges, list: [] };
        _map[item.range].list.push(item);
    });
    const toolHooks: any = luckysheetRef.value.getToolHooks();
    for (let w in _map) {
        const item = _map[w];
        item.list.map((_item: any) => {
            toolHooks.createRegion(item.ranges, {
                type: "数字修约",
                id: _item.uuid,
            }, !0).then((response: Function) => {
                _item.info = response(_item.roundingCondition);
            });
        });
    }
    const range = form.range.split(":").pop();

    form._range = {
        row: range.match(new RegExp("[0-9]+", "i"))?.[0] - 1,
        column: letterGeneratedNumber(range.match(new RegExp("[a-z]+", "i"))?.[0]) - 1,
    };
    const data = (sheet?.celldata || []).find((item: any) => item.r == form._range.row && item.c === form._range.column)?.v || {};
    root.luckysheet.setCellValue(form._range.row, form._range.column, Object.assign(data, { amendmentRules: form.list }));
    form.list.map((item: any) => {
        item._range = form._range;
    });
    setRoundingList.value.push(...form.list);
    setRoundingVisible.value = !!0;
    // console.log(props.hooks.getActiveSheet(luckysheet.value));
}

const setFillContentList_: any = ref([]);
watch(() => $filedStore().treeFields, (v: any) => {
    const list = v.find((i: any) => i.value + "" === "0")?.children || [];
    setFillContentList.value = $$parse($$stringify(list));
    setFillContentList_.value = $$parse($$stringify(list));
}, { immediate: true });

//删除数值修约单元格
function DelSetRoundingListItem(row: { info: any[], uuid: number, range: string, _range: any }) {
    const sub = setRoundingList.value.findIndex((item: { uuid: number }) => item.uuid === row.uuid);
    if (sub > -1) {
        const hooks = props.hooks.getLuckysheet();
        const sheet: any = props.hooks.getActiveSheet(luckysheet.value);
        setRoundingList.value.splice(sub, 1);
        const toolHooks: any = luckysheetRef.value.getToolHooks();
        const [info, callback]: any[] = toolHooks.uuidGetReginsDel(row.info?.at?.(-1));
        const range = row._range;
        const data = (sheet?.celldata || []).find((item: any) => item.r === +(range.row || 0) && item.c === +(range.column || 0))?.v || {};
        hooks.setCellValue(range.row, range.column, {
            ...data,
            amendmentRules: (data.amendmentRules || []).filter((item: any) => item.uuid !== row.uuid),
        });
        callback?.();
    }
}

const setReturnValueVisible = ref<boolean>(!!0);

function setReturnValueFormInfo(): object {
    return {
        calculateCells: "",
        calculationType: "",
        returnType: "",
        range: "",
    };
}

const setReturnValueForm: any = ref<object>(setReturnValueFormInfo());
const setReturnValueFormRules = ref<object>({
    calculateCells: [{ required: true, message: "计算单元格不能为空", trigger: "blur" }],
    calculationType: [{ required: true, message: "计算类型不能为空", trigger: "blur" }],
    returnType: [{ required: true, message: "返回类型不能为空", trigger: "blur" }],
    range: [{ required: true, message: "区域范围不能为空", trigger: "blur" }],
});
const setReturnValueList: any = computed(computedProxy("setReturnValueList"));
const setCellDropdownList: any = computed(computedProxy("setCellDropdownList"));
const returnTypeOption: any = ref<object[]>(returnTypeOptionHook());
const calculationTypeOption: any = ref<object[]>(calculationTypeOptionHook());
const setReturnValueFormRef: any = ref();
watch(setReturnValueVisible, v => {
    if (v) {
        rangeBoxSelectionOptions.value = {
            type: 1,
            info: setReturnValueForm.value,
            is: () => setReturnValueVisible.value,
        };
        if (!setReturnValueForm.value.range) {
            _rangeBoxSelectionHandler(getActiveSheet().luckysheet_select_save, setReturnValueForm);
        }
    } else {
        setReturnValueForm.value = setReturnValueFormInfo();
    }
});

//返回区域重新选区
function setReturnValueListItemSelect(row: object) {
    setReturnValueForm.value = { ...row };
    setReturnValueVisible.value = !0;
}

//单元格选项区域重新选区
function setCellDropdownListItemSelectd(row: object) {
    setCellDropdownForm.value = { ...row };
    setCellDropdownVisible.value = !0;
}

//删除返回范围数据
function delsetReturnListItem(row: { info: any[], uuid: number }) {
    const sub = setReturnValueList.value.findIndex((item: { uuid: number }) => item.uuid === row.uuid);
    if (sub > -1) {
        setReturnValueList.value.splice(sub, 1);
        const toolHooks: any = luckysheetRef.value.getToolHooks();
        const [info, callback]: any[] = toolHooks.uuidGetReginsDel(row.info?.at?.(-1));
        callback?.();
        {
            const { row, column }: rangeTsInterface = info.range;
            const sheet: { data: any[] } = luckysheetRef.value.getActiveSheet();
            const cellItem: any = sheet.data[row[1]][column[1]] || {};
            delete cellItem.is_return_area_uuid;
            root.luckysheet.setCellValue(row[0], column[1], {
                ...cellItem,
                is_return_area_uuid: null,
            });
        }
    }
}

//删除返回范围数据
function delsetCellDropdownListItem(row: { info: any[], uuid: number }) {
    const sub = setCellDropdownList.value.findIndex((item: { uuid: number }) => item.uuid === row.uuid);
    if (sub > -1) {
        setCellDropdownList.value.splice(sub, 1);
        const toolHooks: any = luckysheetRef.value.getToolHooks();
        const [info, callback]: any[] = toolHooks.uuidGetReginsDel(row.info?.at?.(-1));
        callback?.();
        {
            const { row, column }: rangeTsInterface = info.range;
            const sheet: { data: any[] } = luckysheetRef.value.getActiveSheet();
            const cellItem: any = sheet.data[row[1]][column[1]] || {};
            root.luckysheet.setCellValue(row[0], column[1], {
                ...cellItem,
                is_select_area_uuid: null,
            });
        }
    }
}

function setCellDropdownFormSubmit() {
    setCellDropdownFormRef.value?.validate?.(function(v: boolean, residue: object) {
        if (v) {
            delsetCellDropdownListItem(setCellDropdownForm.value);
            const { row, column }: rangeTsInterface = setCellDropdownForm.value.ranges[0];
            if (row[1] - row[0] || column[1] - column[0]) {
                // return proxy.$message({ type: "error", message: "选区操作失败，为单元格" });
            }
            const data = reactive({ ...setCellDropdownForm.value, uuid: Date.now() });
            setCellDropdownList.value.push(data);
            const name = setCellDropdownForm.value.name;
            const toolHooks: any = luckysheetRef.value.getToolHooks();
            toolHooks.createRegion(setCellDropdownForm.value.ranges, {
                type: "单元格选项区域",
                id: data.uuid,
            }, !0).then((response: Function) => {
                data.info = response(name);
            });
            const sheet: { data: any[] } = luckysheetRef.value.getActiveSheet();
            const cellItem: any = sheet.data[row[0]][column[0]] || {};
            root.luckysheet.setCellValue(row[0], column[0], {
                ...cellItem,
                is_select_area_uuid: data.uuid,
            });
            // sheet.data[row[1]].splice(column[1], 1, cellItem);
            setCellDropdownVisible.value = !!0;
            return !0;
        }
        proxy.$message({
            type: "error",
            message: "操作失败，有" + Object.keys(residue).length + "处选项未填",
        });
    });
}

function setReturnSubmit() {
    setReturnValueFormRef.value?.validate?.(function(v: boolean, residue: object) {
        if (v) {
            delsetReturnListItem(setReturnValueForm.value);
            const { row, column }: rangeTsInterface = setReturnValueForm.value.ranges[0];
            if (row[1] - row[0] || column[1] - column[0]) {
                return proxy.$message({ type: "error", message: "选区操作失败，为单元格" });
            }
            const data = reactive({ ...setReturnValueForm.value, uuid: Date.now() });
            setReturnValueList.value.push(data);
            const returnType = setReturnValueForm.value.returnType;
            const toolHooks: any = luckysheetRef.value.getToolHooks();
            toolHooks.createRegion(setReturnValueForm.value.ranges, {
                type: "返回区域",
                id: data.uuid,
            }, !0).then((response: Function) => {
                data.info = response(returnType);
            });
            const sheet: { data: any[] } = luckysheetRef.value.getActiveSheet();
            const cellItem: any = sheet.data[row[1]][column[1]] || {};
            root.luckysheet.setCellValue(row[0], column[1], {
                ...cellItem,
                is_return_area_uuid: data.uuid,
            });
            // sheet.data[row[1]].splice(column[1], 1, cellItem);
            setReturnValueVisible.value = !!0;
            return !0;
        }
        proxy.$message({
            type: "error",
            message: "操作失败，有" + Object.keys(residue).length + "处选项未填",
        });
    });
}

const circularAreaVisible = ref<boolean>(!!0);
const loopLevelOption: any = ref<object[]>(loopLevelOptionHook());

function circularAreaFormInit(): object {
    return {
        range: "",
        loopLevel: "",
        circularAreaName: "",
    };
}

const circularAreaForm: any = ref<object>(circularAreaFormInit());
const circularAreaFormRules = ref<object>(circularAreaFormRulesHook());
const circularAreaFormRef: any = ref<object>({});
watch(circularAreaVisible, v => {
    if (v) {
        circularAreaForm.value = circularAreaFormInit();
        rangeBoxSelectionOptions.value = {
            type: 1,
            info: circularAreaForm.value,
            is: () => circularAreaVisible.value,
        };
        nextTick(() => {
            if (!circularAreaForm.value.range) {
                _rangeBoxSelectionHandler(getActiveSheet().luckysheet_select_save, circularAreaForm);
            }
        });
    }
});

//删除循环范围数据
function delcircularAreaListItem(row: { info: any[], uuid: number }) {
    const sub = circularAreaList.value.findIndex((item: { uuid: number }) => item.uuid === row.uuid);
    if (sub > -1) {
        circularAreaList.value.splice(sub, 1);
        const toolHooks: any = luckysheetRef.value.getToolHooks();
        const [info, callback]: any[] = toolHooks.uuidGetReginsDel(row.info?.at?.(-1));
        callback?.();
    }
}

//自动框选
const rangeBoxSelectionOpen = ref<boolean>(!!0);
//自动框选选项
const rangeBoxSelectionOptions: any = ref<object | null>(null);
//提交luckysheet选中区域
watch(rangeBoxSelectionOpen, v => {
    if (v) {
        const _luckysheet: any = root.luckysheet;
        rangeBoxSelectionHandler(_luckysheet.getRange(), 1);
        luckysheetRef.value.getPubsub?.()?.$emit("add-lucky-sheet-select-cell-or-all-hooks", "add-lucky-sheet-select-cell-or-all-hooks-1", rangeBoxSelectionHandler);
    } else {
        luckysheetRef.value.getPubsub?.()?.$emit?.("del-lucky-sheet-select-cell-or-all-hooks", "add-lucky-sheet-select-cell-or-all-hooks-1");
        rangeBoxSelectionOptions.value = null;
    }
}, {});

function rangeBoxSelectionSubmit() {
    rangeBoxSelectionOptions.value.info.ranges = $$deepClone(rangeBoxSelectionOptions.value.ranges);
    rangeBoxSelectionOptions.value.info.range = rangeBoxSelectionOptions.value.range;
    rangeBoxSelectionOpen.value = !!0;
    rangeBoxSelectionOptions.value = {};
}

// 框选范围操作
function rangeBoxSelectionHandler(v: rangeTsInterface[], flag?: number) {
    if (flag === 1 && rangeBoxSelectionOptions.value.ranges) {
        return;
    }
    if (v.length > +true) {
        proxy.$message({
            type: "error",
            message: "操作失败,不能多选",
        });
        return [];
    }
    if (rangeBoxSelectionOptions.value) {
        let _v = $$deepClone(v);
        rangeBoxSelectionOptions.value.ranges = _v;
        rangeBoxSelectionOptions.value.range = rangeBoxSelectionItemHandler(_v[0]);
    }
}

function _rangeBoxSelectionHandler(v: rangeTsInterface[], rangeBoxSelectionOptions: any) {
    if (v.length > +true) {
        proxy.$message({
            type: "error",
            message: "操作失败,不能多选",
        });
        return [];
    }
    if (rangeBoxSelectionOptions.value) {
        rangeBoxSelectionOptions.value.ranges = $$deepClone(v);
        rangeBoxSelectionOptions.value.range = rangeBoxSelectionItemHandler(rangeBoxSelectionOptions.value.ranges[0]);
    }
}

function _rangeBoxSelectionItemHandler(range: rangeTsInterface) {
    const { row, column }: any = range;
    const scWordSort: string[] = generateAlphabeticalSort(Math.max(row[0] + 1, column[1] + 1));
    return scWordSort[column[0]] + (row[0] + 1) + ":" + scWordSort[column[1]] + (row[1] + 1);
}

function rangeBoxSelectionItemHandler(range: rangeTsInterface) {
    const { row, column }: any = range;
    const scWordSort: string[] = generateAlphabeticalSort(Math.max(row[0] + 1, column[1] + 1));
    let _range: string = "";
    if (rangeBoxSelectionOptions.value.type === +true) {
        _range = scWordSort[column[0]] + (row[0] + 1) + ":" + scWordSort[column[1]] + (row[1] + 1);
    } else if (rangeBoxSelectionOptions.value.type === 2) {
        console.log(row[1] - row[0], column[1] - column[0]);
    }
    return _range;
}

const luckysheet = computed(() => {
    return props.hooks.getLuckysheet();
});
const circularAreaList: any = computed(computedProxy("circularAreaList"));

const returnTypeAreaList: any = computed(computedProxy("returnTypeAreaList"));

//新增循环区域
function circularAreaSubmit() {
    circularAreaFormRef.value?.validate?.(function(v: boolean, residue: object) {
        if (v) {
            delcircularAreaListItem(circularAreaForm.value);
            const data = reactive({ ...circularAreaForm.value, uuid: Date.now() });
            circularAreaList.value.push(data);
            const toolHooks: any = luckysheetRef.value.getToolHooks();
            const circularAreaName = circularAreaForm.value.circularAreaName;
            toolHooks.createRegion(circularAreaForm.value.ranges, {
                type: "循环区域",
                id: data.uuid,
            }, !0).then((response: Function) => {
                data.info = response(circularAreaName);
            });
            circularAreaVisible.value = !!0;
            circularAreaList.value = [...circularAreaList.value];
            return !0;
        }
        proxy.$message({
            type: "error",
            message: "操作失败，有" + Object.keys(residue).length + "处选项未填",
        });
    });
}

//边框可见
function borderVisibleHandler(row: { info: any[] }) {
    const toolHooks: any = luckysheetRef.value.getToolHooks();
    const [info, callback]: any[] = toolHooks.uuidGetReginsHinge(row.info?.at?.(-1));
    callback?.();
}

//边框可见集合
function borderVisiblesHandler(row: { info: any[] }) {
    const toolHooks: any = luckysheetRef.value.getToolHooks();
    const [info, callback]: any[] = toolHooks.uuidGetReginsHinge(row.info?.at?.(-1));
    callback?.();
}

function regionRangeBoxSelection(row: object, callback: Function) {
    circularAreaVisible.value = !0;
    nextTick(() => {
        circularAreaForm.value = { ...row };
        callback?.();
    });
}

function setReturnTypeArea(row: object, callback: Function) {
    returnTypeAreaVisible.value = !0;
    nextTick(() => {
        returnTypeAreaForm.value = { ...row };
        callback?.();
    });
}

const circularAreaFormAlertValue = ref<string>("一级循环由任务内子项目数量进行循环，二级循环由任务内称量条数进行循环 二级区域为方便设置计算公式，可直接设置为多行区域，实际录入时由于称量条数不足造成的空行将自动删除");
const setReturnValueFormAlterValue = ref<string>("返回值用于在记录表单内抓取需要的内容，可以选择直接抓取或计算后抓取");

const returnTypeareaFormAlterValue = ref<string>("不同的区域类型用于抓取不同类型的实测值，必须设置在二级循环内且范围不可重叠");

function maxCircularAreaListRange(circularAreaList: any[]): any {
    return circularAreaList.filter((item: any) => {
        const range = item.info[0];
        return item.loopLevel === "一级";
    }).sort((a: any, b: any) => b.info
        [0].row[1] - a.info[0].row[1]);
}

function findSub(r: number[], c: number[], circularAreaList: object[], uuid: number, sheet: any) {
    const config: any = sheet.config;
    const _listSub: any[] = circularAreaList.filter((item: any) => {
        const range = item.info[0];
        return item.loopLevel === "二级" && r[0] <= range.row[0] && r[1] >= range.row[1] && c[0] <= range.column[0] && c[1] >= range.column[1];
    });
    const _list: any[] = config.returnTypeAreaList.filter((item: any) => {
        const range = item.info[0];
        return r[0] <= range.row[0] && r[1] >= range.row[1] && c[0] <= range.column[0] && c[1] >= range.column[1] && !_listSub.some((_item: any) => {
            const _range = _item.info[0];
            return range.row[0] === _range.row[0] && range.row[1] === _range.row[1];
        }) && item.typeArea !== "空白区域";
    });
    _list.forEach((item: any) => {
        _listSub.push({
            ...item,
            "loopLevel": "二级",
            "circularAreaName": item.typeArea,
        });
    });
    return _listSub;
}


function setCellOptions(sheet: any, cellOptions: any, nRange: any, oRange?: any) {

    if (sheet && nRange && cellOptions) {
        const { celldata } = cellOptions;

    }

}


function rangeJudgment(range: rangeTsInterface, _range: rangeTsInterface_): boolean {
    return _range.r >= range.row[0] && _range.r <= range.row[1] && _range.c >= range.column[0] && _range.c <= range.column[1];
}

function rangesJudgment(range: rangeTsInterface, _range: rangeTsInterface): boolean {
    return _range.row[0] >= range.row[0] && _range.row[1] <= range.row[1] && _range.column[0] >= range.column[0] && _range.column[1] <= range.column[1];
}

function rangesJudgmentCell(range: rangeTsInterface, _range: rangeTsInterface): boolean {
    return (_range.row[0] >= range.row[0] && _range.row[1] <= range.row[1] || _range.row[0] - 1 >= range.row[0] && _range.row[1] - 1 <= range.row[1]) && _range.column[0] - 1 >= range.column[0] && _range.column[1] - 1 <= range.column[1];
}

function rangesJudgmentCellXD(range: rangeTsInterface, _range: rangeTsInterface): boolean {
    return _range.row.join("-") === range.row.join("-") && range.column.join("-") === _range.column.join("-");
}

function findCellOptionsBig(sheet: any, row: number[], column: number[]) {
    const range = { row, column };
    const celldata = sheet.celldata;
    const _config: any = sheet.config;
    const config: any = {};
    config.borderInfo = (_config.borderInfo || []).filter((cellItem: any) => {
        if (cellItem.rangeType === "cell") {
            return cellItem.value.row_index > row[1];
        }
        return cellItem.range[0].row[1] > row[1] && cellItem.range[0].row[0] >= row[0];
    });
    config.rowlen = _config.rowlen;
    return config;
}

function findCellOptions(sheet: any, row: number[], column: number[]) {
    const range = { row, column };
    const celldata = sheet.celldata;
    const _config: any = sheet.config || {};
    if (!_config.borderInfo) _config.borderInfo = [];
    if (!_config.rowlen) _config.rowlen = [];
    if (!_config.merge) _config.merge = [];
    const config: any = {};
    config.celldata = celldata.filter((cellItem: any) => rangeJudgment(range, cellItem));
    config.merge = {};
    config.borderInfo = (_config.borderInfo || []).filter((cellItem: any) => {
        cellItem.range = cellItem.range || [{
            row: [cellItem.value.row_index, cellItem.value.row_index],
            column: [cellItem.value.col_index, cellItem.value.col_index],
        }];
        return rangesJudgment(range, cellItem.range[0]);
    });
    config.rowlen = {};
    for (let w in _config.rowlen) {
        if (rangeJudgment(range, { r: +w, c: range.column[0] })) {
            config.rowlen[w] = _config.rowlen[w];
        }
    }
    for (let w in _config.merge) {
        const merge = _config.merge[w];
        if (merge && rangeJudgment({ row, column }, merge)) {
            config.merge[w] = merge;
        }
    }
    return config;
}

function copyObject(value: any) {
    return JSON.parse(JSON.stringify(value));
}

function cellItemIsField(cellValue: any) {
    return cellValue && Reflect.has(cellValue || {}, "v_code") && new RegExp(/^({).+(})$/).test(cellValue.v_code) && !filesblacklist.some((_item: any) => _item === cellValue?._f);
}

function setCellItemIsField(cellValue: any, field: any) {
    if (cellValue && cellItemIsField(cellValue)) {
        !cellValue._v_code_wz && (cellValue._v_code_wz = cellValue.m);
        cellValue._f_code_ref_loop = !0;
        let v = field[cellValue._f] || "";
        cellValue.m = v;
        cellValue.v = v;
        cellValue.__fieldInfo = { id: field.id };
    }
    return cellValue || null;
}

function setCellBorderInfo(borderInfo: any, num: number) {
    return copyObject(borderInfo).map((info: any) => {
        const __range = info.range[0];
        const cellItem = Object.assign(info, {
            range: [{
                ...__range,
                row: [__range.row[0] + num, __range.row[1] + num],
            }],
        });
        if (cellItem.rangeType === "cell") {
            const style__ = (cellItem.value.b || cellItem.value.t || cellItem.value.l || cellItem.value.r);
            cellItem.value.row_index = cellItem.range[0].row[0];
            cellItem.value.col_index = cellItem.range[0].column[0];
            cellItem.rangeType = "range";
            cellItem.color = style__.color;
            cellItem.borderType = "border-all";
            cellItem.style = style__.style;
        }
        return cellItem;
    });
}

function setCellBorderInfo_(borderInfo: any, num: number) {
    return borderInfo.map((info: any) => {
        const __range = info.range[0];
        const cellItem = Object.assign(info, {
            range: [{
                ...__range,
                row: [__range.row[0] + num, __range.row[1] + num],
            }],
        });
        if (cellItem.rangeType === "cell") {
            const style__ = (cellItem.value.b || cellItem.value.t || cellItem.value.l || cellItem.value.r);
            cellItem.value.row_index = cellItem.range[0].row[0];
            cellItem.value.col_index = cellItem.range[0].column[0];
            cellItem.rangeType = "range";
            cellItem.color = style__.color;
            cellItem.borderType = "border-all";
            cellItem.style = style__.style;
        }
        return cellItem;
    });
}

function setSheetConfig(config: any, range: rangeTsInterface, lineNum: number) {
    config.borderInfo = setCellBorderInfo_(config.borderInfo, lineNum);
    config.rowlen = {};
    return config;
}

function setSheetConfigHook(sheet: any, oldConfig: any, range: rangeTsInterface, addLineCount: number) {
    const rowlen_ = copyObject(oldConfig.rowlen);
    const rowlen__: number[] = [];
    for (let w in rowlen_) {
        if (+w > range.row[1]) {
            if (rowlen__.indexOf(+w) === -1) {
                delete sheet.config.rowlen[w];
            } else {
            }
            rowlen__.push((+w + addLineCount));
            sheet.config.rowlen[(+w + addLineCount)] = rowlen_[w];
        }
    }
    const merge__: number[] = [];
    for (let w = 0; w < sheet.data.length; w++) {
        for (let i = 0; i < sheet.data[w].length; i++) {
            const cellValue = sheet.data[w][i];
            if (cellValue && cellValue.mc && cellValue.mc.r > range.row[1] && !cellValue.mc.is_loop_return_area) {
                const _r = cellValue.mc.r + addLineCount;
                if (Reflect.has(cellValue.mc, "rs")) {
                    if (merge__.indexOf(cellValue.mc.r) === -1) {
                        delete sheet.config.merge[cellValue.mc.r + "_" + cellValue.mc.c];
                    }
                    sheet.config.merge[_r + "_" + cellValue.mc.c] = cellValue.mc;
                    merge__.push(_r);
                }
                cellValue.mc.r = _r;
            }
        }
    }
}

function findSheetLoopItemReturnArea(loopSheet: any[][], options: any) {
    if (typeof options !== "object" || options === null) options = {};
    const returnArea = {};
    for (let w = 0; w < loopSheet.length; w++) {
        for (let k = 0; k < loopSheet[w].length; k++) {
            if (loopSheet[w][k] && ("is_return_area_uuid" in loopSheet[w][k]) && loopSheet[w][k].is_return_area_uuid) {
                returnArea[`${w}-${k}`] = {
                    cellData: loopSheet[w][k],
                    returnAreaInfo: options.sheet.config.setReturnValueList.find((item: any) => item.uuid === loopSheet[w][k].is_return_area_uuid),
                };
                loopSheet[w][k].returnAreaInfo = returnArea[`${w}-${k}`].returnAreaInfo;
            }
        }
    }
    return returnArea;
}


function findCellDataF(sheet: any, range: rangeTsInterface, addRowNum: number, loopNum: number, list: any) {
    const data = sheet.data;
    const fCellData = [];
    for (let w = 0; w < data.length; w++) {
        for (let i = 0; i < data[w].length; i++) {
            if (data[w][i] && data[w][i].f && w >= range.row[0]) {
                if (data[w][i].f_ref_flag) {
                    delete data[w][i].f_ref_flag;
                    continue;
                }
                fCellData.push({ r: w, c: i, v: data[w][i] });
            }
        }
    }
    fCellData.forEach((item: any) => {
        const ranges = item.v.f.replace(/[A-Z]+\d+/g, (_item: string) => {
            if (_item.indexOf("$") > -1) return _item;
            return _item.replace(/\d+/, v => {
                if (+v < range.row[0] || +v < range.row[0]) return v;
                return range.row[0] + addRowNum >= +item.r ? range.row[0] + list.findIndex((_item: any) => _item.some((__item: any) => __item === item.v)) + 1 : (+v + addRowNum - loopNum).toString();
            });
        });
        item.v.f = ranges || item.v.f;
    });
    sheet.calcChain = [];
    for (let w = 0; w < sheet.data.length; w++) {
        for (let i = 0; i < sheet.data[w].length; i++) {
            sheet.data[w][i]?.f && sheet.calcChain.push({ r: w, c: i, index: sheet.index });
        }
    }
}

function createLoopAreaBorderInfo(range: rangeTsInterface, list: any[][]) {
    return {
        "rangeType": "range",
        "value": {
            "row_index": range.row[0],
            "col_index": range.column[0],
            "l": {
                "style": 1,
                "color": "rgb(0, 0, 0)",
            },
            "t": {
                "style": 1,
                "color": "rgb(0, 0, 0)",
            },
            "b": {
                "style": 1,
                "color": "rgb(0, 0, 0)",
            },
        },
        "range": [
            {
                "row": [range.row[0], range.row[0] + list.length - 1],
                "column": range.column,
            },
        ],
        "color": "rgb(0, 0, 0)",
        "borderType": "border-all",
        "style": 1,
    };
}

function setCurrentSheetConfigHook(____list: any[][], range: any, sheet: any) {
    for (let w = 0; w < ____list.length; w++) {
        const _row = range.row[0] + w;
        if (Reflect.has(____list[w][0] || {}, "rowlenDep")) {
            sheet.config.rowlen[_row] = Reflect.get(____list[w][0] || {}, "rowlenDep");
        }
        for (let q = 0; q < ____list[w].length; q++) {
            if (____list[w][q] && ____list[w][q].mc) {
                if (Reflect.has(____list[w][q].mc, "cs") && Reflect.has(____list[w][q].mc, "rs")) {
                    ____list[w][q].mc = Object.assign(____list[w][q].mc, { r: range.row[0] + w });
                    sheet.config.merge[range.row[0] + w + "_" + ____list[w][q].mc.c] = ____list[w][q].mc;
                } else if (Reflect.has(____list[w][q].mc, "_merge_")) {
                    ____list[w][q].mc = Object.assign({ ...____list[w][q].mc._merge_ }, { rs: 0, cs: 0 });
                }
            }
        }
    }
}

function setLoopCellOptionsInfo(cellItem: any, options: any, subProject: any, ___frequency: number, index: number, _range: any) {
    return Object.assign(cellItem || {}, {
        sub_loop_index: index,
        sub_loop_ref: !0,
        loop_msg: {
            root: {
                id: options.project[___frequency].id,
                options: options.project[___frequency].options,
            },
            self: { id: subProject[index].id, options: subProject[index].options },
        },
        sub_loop_range_r_s: _range.row[0],
        sub_loop_range_r_d: _range.row[1],
    });
}

function classifyTwoLoopAreaOptions(subs: any[], range: rangeTsInterface, sheet: any, _returnTypeAreaFormTypeAreaOptions: any, subProject: any[], c_list: any) {
    return subs.map((sub: any) => {
        const _range = sub.info[0];
        const startIndex = _range.row[0] - range.row[0];
        const endIndex = startIndex + _range.row[1] - _range.row[0] + 1 || 0;
        const returnTypeAreaItem = sheet.config.returnTypeAreaList.find((item: any) => {
            return rangesJudgment(_range, item.info[0]);
        });
        const type: any = _returnTypeAreaFormTypeAreaOptions.find((item: any) => returnTypeAreaItem?.typeArea === item.value);
        return {
            subProject: !type ? subProject : subProject.filter((item: any) => item.weightNumber && item.weightNumber.indexOf(type._value) > -1),
            list: copyObject(c_list.slice(startIndex, endIndex)),
            controlType: returnTypeAreaItem,
            type: type || { _value: "__" },
            startIndex,
            endIndex,
            _list: [],
            range: _range,
        };
    });
}

function reverseOrderCircularAreaList(circularAreaList: object[], options: assignmentLoopAreaOptions, _sheet: any) {
    if (!circularAreaList.length) return _sheet;
    const list = maxCircularAreaListRange(circularAreaList);
    const sheet = _sheet;
    const _returnTypeAreaFormTypeAreaOptions = returnTypeAreaFormTypeAreaOptions();

    function __run(_frequency: number) {
        if (_frequency > list.length - 1) return;
        const item: any = list[_frequency];
        const range: rangeTsInterface = item.info[0];
        const subs: any[] = findSub(range.row, range.column, circularAreaList, item.uuid, sheet).sort((a: any, b: any) => b.info
            [0].row[1] - a.info[0].row[1]);
        const rows = range.row[1] - range.row[0] + 1;
        const _list: any[][] = generatedArray(rows, () => generatedArray(sheet.column, null));
        const _config = findCellOptions(sheet, range.row, range.column);
        _config.celldata.forEach((cellItem: any) => {
            const _listItem = _list[cellItem.r - range.row[0]];
            _listItem[cellItem.c] = cellItem.v;
            _listItem.forEach((_item: any, index: number) => {
                const _cellItem = { ...(_item || {}), loop_uuid: item.uuid, loop_index: _frequency };
                if (Reflect.has(_config.rowlen, cellItem.r)) {
                    _cellItem.rowlenDep = _config.rowlen[cellItem.r];
                }
                _listItem.splice(index, 1, _cellItem);
            });
        });
        const returnArea = findSheetLoopItemReturnArea(_list, { sheet }) || {};
        const ____list: any[] = [];
        let __config = findCellOptionsBig(sheet, range.row, range.column);
        const oldConfig = copyObject(sheet.config);
        const _borderInfo = copyObject(_config.borderInfo);
        _borderInfo.forEach((__item: any) => {
            const order = ["color", "borderType", "style"];
            const _sub = sheet.config.borderInfo.findIndex((___item: any) => {
                if (___item.rangeType && __item.rangeType) {
                    return (order.every((i: any) => ___item[i] === __item[i]) || ___item.range === "cell") && ___item.range[0].row[0] === __item.range[0].row[0] && ___item.range[0].row[1] === __item.range[0].row[1];
                }
            });
            if (_sub > -1) {
                sheet.config.borderInfo.splice(_sub, 1);
            }
        });

        function ___run(c_list: any, ___frequency: number) {
            const ____listlen = ____list.length;
            if (___frequency > options.project.length - 1) return;
            const subProject = options.subProject || options.project[___frequency]?.subProject || [];
            for (let w = 0; w < c_list.length; w++) {
                for (let q = 0; q < c_list[w].length; q++) {
                    setCellItemIsField(c_list[w][q], options.project[___frequency]);
                    if (c_list[w][q] == null) {
                        c_list[w].splice(q, 1, {});
                    }
                    Object.assign(c_list[w][q], {
                        loop_msg: { root: { id: options.project[___frequency].id } },
                    });
                }
            }
            const _subs = classifyTwoLoopAreaOptions(subs, range, sheet, _returnTypeAreaFormTypeAreaOptions, subProject, c_list).sort((pre: any, cur: any) => pre.startIndex - cur.startIndex);
            // console.log(_subs);
            let addLineNum = 0;

            for (let w in _subs) {
                const item = _subs[w];
                const _range = item.range;
                const startIndex = item.startIndex;
                const endIndex = item.endIndex;
                const subProject = item.subProject;
                const _merge = {};
                const __list = generatedArray(subProject.length, (index: number) => {
                    const list: any[] = copyObject(item.list).map((item: object[], w: number) => {
                        return item.map((_item: object, q: number) => {
                            let cellItem = setLoopCellOptionsInfo(_item, options, subProject, ___frequency, index, _range);
                            const itemReturnArea: any = returnArea[`${w + startIndex}-${q}`];
                            const lineNum = c_list.slice(0, endIndex - 1).reduce((pre: any, cur: any) => cur instanceof Array ? pre + 1 : pre + cur?.list?.length, 0) + ____listlen;
                            if (itemReturnArea?.returnAreaInfo) {
                                const returnAreaInfo: any = itemReturnArea.returnAreaInfo;
                                switch (returnAreaInfo.calculationType) {
                                    case "直接抓取":
                                        break;
                                    case "计算平均值":
                                        const calculateCells = returnAreaInfo.calculateCells;
                                        const calcChainRanges = parseLetterCoordinates(calculateCells);
                                        const rangesLoop = calcChainRanges.filter((item: rangeTsInterface) => rangesJudgment(_range, item));
                                        const AVERAGEARanges: rangeTsInterface[][] = [];
                                        for (let w = 0; w < subProject.length; w++) {
                                            AVERAGEARanges.push(rangesLoop.map((item: rangeTsInterface) => ({
                                                row: [range.row[0] + lineNum + w, range.row[0] + lineNum + w],
                                                column: item.column,
                                            })));
                                        }
                                        const f = `=AVERAGEA(${rangeToWordStr(AVERAGEARanges.flat()).map((item: string) => {
                                            const arr = item.split(":");
                                            return arr[0] === arr[1] ? arr[0] : item;
                                        }).join(",")})`;
                                        cellItem.f_ref_flag = true;
                                        cellItem.f = f;
                                    default:
                                        if (!index) {
                                            cellItem = Object.assign(cellItem, {
                                                mc: {
                                                    r: _range.row[0],
                                                    c: q,
                                                    is_loop_return_area: !0,
                                                    rs: subProject.length,
                                                    cs: 1,
                                                },
                                            });
                                            _merge[q] = cellItem.mc;
                                        } else {
                                            cellItem.mc = { _merge_: _merge[q] };
                                        }
                                        break;
                                }
                            }
                            setCellItemIsField(cellItem, subProject[index]);
                            if (cellItem.f && !cellItem.f_ref_flag) {
                                cellItem.f = cellItem.f.replace(/[A-Z]+\d+/g, (_item: string) => {
                                    if (_item.indexOf("$") > -1) return _item;
                                    return _item.replace(/\d+/, (v: any) => {
                                        if (+v <= range.row[0]) return v;
                                        if (+v <= _range.row[0]) {
                                            return +v + ____list.length;
                                        }
                                        return range.row[0] + lineNum + 1 + index;
                                    });
                                });
                                cellItem.f_ref_flag = !0;
                            }
                            return cellItem;
                        });
                    });
                    addLineNum++;
                    return list;
                });
                c_list.splice(startIndex, endIndex - startIndex, { list: item.type?._value === "MB" && !__list.length ? [item.list] : __list });
            }
            ____list.push(...(c_list || []).reduce((pre: any, cur: any) => {
                if (cur instanceof Array) {
                    pre.push(cur);
                } else pre.push(...cur.list.flat());
                return pre;
            }, []));
            ___run(copyObject(_list), ++___frequency);
        }

        ___run(copyObject(_list), 0);
        sheet.config.borderInfo.push(createLoopAreaBorderInfo(range, ____list));
        __config = setSheetConfig(__config, range, ____list.length - _list.length);
        __config.borderInfo?.forEach?.((item: any) => {
            const sub: number = sheet.config.borderInfo.findIndex((_item: any) => _item === item);
            sheet.config.borderInfo.splice(sub, 1, item);
        });
        setSheetConfigHook(sheet, oldConfig, range, ____list.length - _list.length);
        setCurrentSheetConfigHook(____list, range, sheet);
        sheet.data.splice(range.row[0], range.row[1] - range.row[0] + 1, ...____list);
        findCellDataF(sheet, range, ____list.length, _list.length, ____list);
        list[_frequency].isCompleteLoop = !0;
        __run(++_frequency);
    }

    __run(0);
    sheet.celldata = [];
    return sheet;
}

interface assignmentLoopAreaOptions {
    project: any[],
    subProject?: any[]
}

//sheet.data 循环区域操作
function assignmentLoopArea(options: assignmentLoopAreaOptions, sheetInfo?: any) {
    if (options.project) {
        const sheet: any = sheetInfo || (props.hooks.getActiveSheet(luckysheet.value));
        if (!sheet) return sheet;
        const circularAreaList = sheet?.config?.circularAreaList?.filter?.((item: {
            isCompleteLoop?: boolean
        }) => !item.isCompleteLoop) || [];
        return reverseOrderCircularAreaList(circularAreaList, options, sheet);
    }
}

//查找返回区域的内容
function dedicateSheetContent(sheet: { data: object[][], config: { setReturnValueList: any[] } }) {
    const data = sheet.data || [];
    const setReturnValueList = sheet.config.setReturnValueList || [];
    return data.map((cell: any[]) => {
        return cell.filter((column: any) => {
            if (column && "is_return_area_uuid" in column) {
                return setReturnValueList.some((item: any) => item.uuid === column.is_return_area_uuid);
            }
            return !~~1;
        });
    }).filter((item: any[]) => item?.length).flat();
}

//查找类型返回区域的内容
function dedicateSheetTypeAreaContent(sheet: { data: object[][], config: { returnTypeAreaList: any[] } }) {
    const data = sheet.data || [];
    const setReturnValueList = sheet.config.returnTypeAreaList || [];
    return data.map((cell: any[]) => {
        return cell.filter((column: any) => {
            if (column && "type_area_uuid" in column && column.type_area_start) {
                return setReturnValueList.some((item: any) => item.uuid === column.type_area_uuid);
            }
            return !~~1;
        });
    }).filter((item: any[]) => item?.length).flat();
}

function grabLoopAreaHook(sheet: { data: object[][] }) {
    const data = sheet.data || [];
    return data.map((cell: any[], index: number) => {
        return cell.map((column: any, sub: number) => {
            return { r: index, c: sub, v: column };
        }).filter((column: any) => column && column.v && "loop_uuid" in column.v);
    }).filter((item: any[]) => item?.length);
}


function renewLoopSheetData(renewData: { id: number | string }[] | object, renewKey?: string[] | string) {
    const hooks: any = luckysheetRef.value.getLuckysheet();
    const _renewData = renewData instanceof Array ? renewData : [renewData];
    const _renewKey = renewKey instanceof Array ? renewKey : [renewKey || {}];
    const loopData = grabLoopAreaHook(getActiveSheet()).map((item: any) => item.filter((_item: any) => _item.v.sub_loop_ref && _renewData.some((item: any) => item.id === _item.v?.loop_msg?.self?.id))).filter((item: any) => item.length);
    const dataJSON = synthesisLoopDataFieldJSON(synthesisLoopData(loopData.flat()));
    for (let w in dataJSON) {
        const sub = _renewData.find((item: any) => item.id === w);
        if (sub) {
            dataJSON[w].filter((item: any) => item.v && item.v.v_code && _renewKey.indexOf(item.v._f) > -1).forEach((item: any) => {
                item.v.v = sub[item.v._f];
                item.v.m = sub[item.v._f];
            });
        }
    }
    setTimeout(() => {
        hooks.refresh({});
    }, 20);
}

function synthesisLoopData(data: any[]) {
    const json = {};
    data.forEach((item: { v: any }) => {
        if (item.v?.sub_loop_index != void 0) {
            if (!json[item.v.sub_loop_index])
                json[item.v.sub_loop_index] = [];
            json[item.v.sub_loop_index].push(item);
        }

    });
    return json;
}

function synthesisLoopDataFieldJSON(dataJSON: object) {
    const _dataJSON = {};
    for (let w in dataJSON) {
        dataJSON[w].forEach((item: any) => {
            const v = item.v || {};
            const self = v.loop_msg?.self;
            if (self && v._f && v.v_code) {
                if (!_dataJSON[self.id]) _dataJSON[self.id] = [];
                _dataJSON[self.id].push(item);
            }
        });
    }
    return _dataJSON;
}

function synthesisLoopDataField(dataJSON: object) {
    const _dataJSON = {};
    for (let w in dataJSON) {
        dataJSON[w].forEach((item: any) => {
            const v = item.v || {};
            const self = v.loop_msg?.self;
            if (self && v._f && v.v_code) {
                if (!_dataJSON[self.id]) _dataJSON[self.id] = {};
                _dataJSON[self.id][item.v._f] = item.v.v;
            }
        });
    }
    return _dataJSON;
}

const rfid = "luckysheet_altert_" + Date.now();
pubsub.$emit("add-lucky-sheet-select-tip-lines-all-hooks", rfid, function(...args: any[]) {
    const list = reactive([circularAreaList.value,
        setReturnValueList.value,
        setRoundingList.value,
        returnTypeAreaList.value].flat());
    const list2 = args[0].map((item: any) => item.list).flat();
    for (let w of list) {
        const sub = list2.find((i: any) => i.id === w.uuid);
        w.showFlag = sub?.display;
    }
});

onUnmounted(() => {
    pubsub.$emit("del-lucky-sheet-select-tip-lines-all-hooks", rfid);
});


defineExpose({
    circularAreaVisible: (v: boolean) => {
        circularAreaVisible.value = v;
    },
    setRoundingVisible: (v: boolean) => setRoundingVisible.value = v,
    setReturnValueVisible: (v: boolean) => setReturnValueVisible.value = v,
    setReturnTypeAreaVisible: (v: boolean) => returnTypeAreaVisible.value = v,
    setCellDropdownVisible: (v: boolean) => setCellDropdownVisible.value = v,
    setFillContent: (v: boolean) => setFillContent.value = v,
    delSetRoundingListItem: DelSetRoundingListItem,
    delcircularAreaListItem: delcircularAreaListItem,
    delsetReturnListItem: delsetReturnListItem,
    borderVisibleHandler,
    regionRangeBoxSelection,
    delReturnTypeAreaListItem,
    setReturnValueListItemSelect,
    borderVisiblesHandler,
    circularAreaList,
    setReturnValueList,
    setRoundingList,
    returnTypeAreaList,
    assignmentLoopArea,
    fillContentHook,
    fillContentHookObject,
    setReturnTypeArea,
    dedicateSheetContent,
    dedicateSheetTypeAreaContent,
    grabLoopAreaHook,
    renewLoopSheetData,
    getSelectedsStatus,
    delsetCellDropdownListItem,
    setCellDropdownList,
    setCellDropdownListItemSelectd,
});
</script>