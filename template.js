export function template() {
    return `
    
    <template>
    <el-dialog v-model="isShowDialog" :title="title" :width="1200" :fullscreen="dialogFull" @close="closeDialog">
        <el-form v-if="isShowDialog" ref="itemsRef" :model="form" :rules="rules" label-width="120px"
                 v-loading="loading" style="min-height: 85vh;">
            <el-row style="height:50px;">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <div style="float:left; padding-left:20px;">
                        <span
                            style="font-family:微软雅黑 Bold;, sans-serif;font-weight:700;color:#409EFF;">▋</span>
                        <b>基本信息</b>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <div style="float:right;margin-right: 100px;">
                        <span style="color:#D9001B;">*</span>
                        <span style="color:#999999;"> 为必填项</span>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin: 15px 0;">
                <el-table :data="form.xiangmuReports" border style="width: 100%" max-height="350"
                          :row-class-name="tableRowClassName" :span-method="xiangmuReportsMergeHandler">
                    <el-table-column prop="code" label="项目代码" align="center" width="80" />
                    <el-table-column prop="itemName" label="子项目名称" min-width="140" align="center"
                                     show-overflow-tooltip />
                    <el-table-column prop="itemReportName" label="子项目报告名称" align="center" min-width="180"
                                     show-overflow-tooltip>
                        <template #header>
                            <span required>子项目报告名称</span>
                        </template>
                        <template #default="{row}">
                            <el-input type="text" multiple v-model="row.itemReportName"
                                      placeholder=" " clearable />
                        </template>
                    </el-table-column>
                    <el-table-column prop="inspectionMethodNameShort" label="检测方法" align="center" width="180"
                                     show-overflow-tooltip />
                    <el-table-column label="检出限" align="center" prop="detectionLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.detectionLimitValueList" placeholder=" "
                                               v-if="row.detectionLimitValueList&&row.detectionLimitValueList instanceof Array"
                                               v-model="row._detectionLimitValue" />
                            <el-input v-else :value="row._detectionLimitValue" disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="定量限" align="center" prop="quantificationLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.quantificationLimitValueList" placeholder=" "
                                               v-if="row.quantificationLimitValueList instanceof Array"
                                               v-model="row._quantificationLimitValue" />
                            <el-input v-else :value="row._quantificationLimitValue"
                                      disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="其它检测限" align="center" prop="otherLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.otherLimitValueList" placeholder=" "
                                               v-if="row.otherLimitValueList instanceof Array"
                                               v-model="row._otherLimitValue" />
                            <el-input v-else :value="row._otherLimitValue"
                                      disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="单项目报告备注" align="center" prop="reportRemark" width="150"
                                     show-overflow-tooltip="">
                        <template #default="scope">
                            <el-input v-model="scope.row.reportRemark" placeholder="单项目报告备注" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row style="margin: 15px 0;">
                <el-table :data="form.xiangmuReport||[]" border style="width: 100%" max-height="350">
                    <el-table-column prop="itemName" label="项目名称" min-width="140" align="center"
                                     show-overflow-tooltip />
                    <el-table-column prop="itemReportName" label="项目报告名称" align="center" min-width="180"
                                     show-overflow-tooltip>
                        <template #header>
                            <span required>项目报告名称</span>
                        </template>
                        <el-form-item prop="itemReportName" class="el-form-item-origin">
                            <el-input type="text" multiple v-model="form.itemReportName"
                                      placeholder=" " clearable />
                        </el-form-item>
                    </el-table-column>
                    <el-table-column prop="inspectionMethodNameShort" label="检测方法" align="center" width="180"
                                     show-overflow-tooltip />
                    <el-table-column label="检出限" align="center" prop="detectionLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.detectionLimitValueList" placeholder=" "
                                               v-if="row.detectionLimitValueList&&row.detectionLimitValueList instanceof Array"
                                               v-model="row._detectionLimitValue" />
                            <el-input v-else :value="row._detectionLimitValue" disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="定量限" align="center" prop="quantificationLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.quantificationLimitValueList" placeholder=" "
                                               v-if="row.quantificationLimitValueList instanceof Array"
                                               v-model="row._quantificationLimitValue" />
                            <el-input v-else :value="row._quantificationLimitValue"
                                      disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="其它检测限" align="center" prop="otherLimitValue" min-width="130"
                                     show-overflow-tooltip>
                        <template #default="{row}">
                            <el-select-package :options="row.otherLimitValueList" placeholder=" "
                                               v-if="row.otherLimitValueList instanceof Array"
                                               v-model="row._otherLimitValue" />
                            <el-input v-else :value="row._otherLimitValue"
                                      disabled
                                      placeholder=" " />
                        </template>
                    </el-table-column>
                    <el-table-column label="单项目报告备注" align="center" prop="reportRemark" width="150"
                                     show-overflow-tooltip="">
                        <template #default="scope">
                            <el-input v-model="scope.row.reportRemark" placeholder="单项目报告备注" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row style="margin-top: 20px" v-if="projectType === 1">
                <el-col :xs="24" :sm="20" :md="20" :lg="20" :xl="24">
                    <el-form-item label="计算公式">
                        <el-input v-model="form.formula" placeholder="计算公式" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="35">
                <el-form-item label="出具结果方式" style="width: 50%" prop="reportType">
                    <el-select-package :disabled="true" style="width: 100%" v-model="form.reportType"
                                       placeholder="出具结果方式" :options="lims_report_type" />
                </el-form-item>
            </el-row>
            <el-row style="padding-top: 20px;">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                    <el-table :data="dataTestmethodList" border>
                        <el-table-column label="样品大类" align="center" prop="sampleCategoryA" min-width="130"
                                         show-overflow-tooltip fixed="left" />
                        <el-table-column label="样品亚类" align="center" prop="sampleCategoryB" min-width="130"
                                         show-overflow-tooltip fixed="left" />
                        <el-table-column label="样品次亚类" align="center" prop="sampleCategoryC" min-width="130"
                                         show-overflow-tooltip />
                        <el-table-column label="样品细类" align="center" prop="sampleCategoryD"
                                         show-overflow-tooltip min-width="130" />
                        <el-table-column label="判断依据" align="center" prop="judgeBasisNumber" min-width="120"
                                         show-overflow-tooltip>
                            <template #default="scope">
                                <chooseJudgment :MatName="scope.row.judgeBasisNumber" :index="scope.$index"
                                                @ChooseRow="ChooseRow"
                                                :config="{row:{itemName:form.itemReportName}}"></chooseJudgment>
                            </template>
                        </el-table-column>
                        <el-table-column label="判定值" align="center" prop="judgeManualValue" min-width="100"
                                         show-overflow-tooltip>
                            <template #default="{row}">
                                <!--                                <el-input disabled v-model="row.judgeManualValue" placeholder=" " />-->
                            </template>
                        </el-table-column>
                        <el-table-column label="判定值确认" align="center" prop="isConfirm"
                                         min-width="100" show-overflow-tooltip>
                            <template #header>
                                <span required>判定值确认</span>
                            </template>
                            <template #default="{row}">
                                <el-select-package :options="lims_yes_no" v-model="row.isConfirm" placeholder="必填" />
                            </template>
                        </el-table-column>
                        <el-table-column label="项目类别" align="center" prop="itemType" min-width="140"
                                         show-overflow-tooltip>
                            <template #default="scope">
                                <el-select-package multiple :options="sys_category_attributes"
                                                   v-model="scope.row.itemType"
                                                   placeholder=" " />
                            </template>
                        </el-table-column>
                        <el-table-column label="不合格类别" align="center" prop="failedType" min-width="130"
                                         show-overflow-tooltip>
                            <template #default="scope">
                                <el-select-package :options="lims_failed_type" v-model="scope.row.failedType"
                                                   placeholder=" " />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row :gutter="35" v-if="projectType === 1">
                <CommonForm v-model="form" :resultUnits="resultUnits" />
                <el-col>
                    <el-form :rules="rules" v-model="item.info" :ref="v=>item.info.elFormRef=v" :gutter="35"
                             label-width="160px"
                             v-for="(item,index) in form.xiangmuReports.map(item=>({info:item}))">
                        <el-col v-if="delayedRender?.(index)">
                            <el-col>
                                <el-form>
                                    <el-form-item label="子项目" style="margin: 0">
                                        {{ item.info.itemReportName }}
                                    </el-form-item>
                                </el-form>
                            </el-col>
                            <CommonForm v-model="item.info.selfForm" :resultUnits="resultUnits" />
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" :disabled="!form.xiangmuReports?.length||!dataTestmethodList.length"
                           @click="submitForm">保 存
                </el-button>
            </div>
        </template>
    </el-dialog>
    <Test-Dialog ref="testDialogRef" @reloadTable="submitTestMethodList"
                 :dataTestmethodList="form.xiangmuReports" @reloadTableRow="reloadTableRow" />
    <PinleiDialog ref="pinleiDialogRef" @reloadTable="subTableList" v-if="isShowDialog"
                  :showList="dataTestmethodList" />
</template>
    `
}