export function template() {
    return `
<!--啊v1111234234
你424234好234243243242-->
  <?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<!DOCTYPE html PUBLIC 
"-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" >
<head>
<title>CDATA Example</title>
</head>
<body>

<h2>Using a Comment</h2>
<div id="commentExample">
<!--
You won't see this in the document
and can use reserved characters like
< > & "
-->
</div>

<h2>Using a CDATA Section</h2>
<div id="cdataExample">
<![CDATA[
You will see this in the document
and can use reserved characters like
< > & "
]]>
</div>
</body>
</html>`
    return `<br/><hr/>你好<!----
  
  <div 你好 >
  
  ---->
  <!DOCTYPE adsf html>
  <!DOCTYPE asd 
   html>
  <![CDATA[
    Within this Character Data block I can
    use double dashes as much as I want (along with <, &, ', and ")
    *and* %MyParamEntity; will be expanded to the text
    "Has been expanded" ... however, I can't use
    the CEND sequence. If I need to use CEND I must escape one of the
    brackets or the greater-than sign using concatenated CDATA sections.
    ]]>
    <description>An example of escaped CENDs</description>
<!-- This text contains a CEND ]]> -->
<!-- In this first case we put the ]] at the end of the first CDATA block
     and the > in the second CDATA block -->
<data><![CDATA[This text contains a CEND ]]]]><![CDATA[>]]></data>
<!-- In this second case we put a ] at the end of the first CDATA block
     and the ]> in the second CDATA block -->
<alternative><![CDATA[This text contains a CEND ]]]><![CDATA[]>]]></alternative>
    <template #default="{ row }" html="<div html="你好" title='<p>失败</p>'></div>">
        <span @click="viewRecordInf(row)" style="cursor:pointer;">{{ row.inspectionItemName }}</span>
    </template>
  <template>
    <el-row v-loading="loading" style="width: 100%;margin: 10px auto;">
      <el-table :data="sameBatchOfTasksList" border stripe style="width: 100%;margin:0 auto;"
                @cell-dblclick="cellDblclick">
          <el-table-column prop="inspectionItemName" label="检测项目" align="center" min-width="180"
                           show-overflow-tooltip>
              <template #default="{ row }">
                  <span @click="viewRecordInf(row)" style="cursor:pointer;">{{ row.inspectionItemName }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="inspectionMethodNameShort" label="检测方法" align="center" min-width="160" sortable
                           show-overflow-tooltip />
          <el-table-column prop="judgmentBasis" label="判定依据" align="center" min-width="110"
                           show-overflow-tooltip />
          <el-table-column prop="pandingValue" label="判定值" align="center" show-overflow-tooltip min-width="90" />
          <el-table-column prop="resultValue" label="实测值" align="center" show-overflow-tooltip min-width="70" />
          <el-table-column prop="singleItemConclusion" label="单项结论" align="center" min-width="90"
                           show-overflow-tooltip>
              <template #default="{ row }">
                  {{ $dictFindItem(lims_single_conclusion, row.singleItemConclusion) }}
              </template>
          </el-table-column>
          <el-table-column prop="controlType" label="质控类型" align="center" min-width="80" show-overflow-tooltip>
              <template #default="{ row }">
                  {{ $$controlType(row.controlType) }}
              </template>
          </el-table-column>
          <el-table-column prop="controlPlanNumber" label="质控计划编号" align="center" min-width="110"
                           show-overflow-tooltip />
          <el-table-column prop="inspectionPerson" label="检测人" align="center" show-overflow-tooltip min-width="80">
              <template #default="{ row }">{{ $dictFindUserValue(row.inspectionPerson) }}</template>
          </el-table-column>
          <el-table-column prop="inspectionAssistPerson" label="检测协助人" align="center" width="100"
                           show-overflow-tooltip>
              <template #default="{ row }">{{ $dictFindUserValue(row.inspectionAssistPerson) }}</template>
          </el-table-column>
          <el-table-column prop="inspectionBatchNumber" label="检测组批编号" align="center" min-width="110"
                           show-overflow-tooltip />
          <el-table-column prop="inspectionTime" label="检测日期" align="center" min-width="100"
                           show-overflow-tooltip >
              <template #default="{row}">
                  {{$dictFormatDate(row.inspectionTime)}}
              </template>
          </el-table-column>
          <el-table-column prop="checkPerson" label="校核人" min-width="80" align="center" show-overflow-tooltip>
              <template #default="{ row }">{{ $dictFindUserValue(row.checkPerson) }}</template>
          </el-table-column>
          <el-table-column prop="checkTime" label="校核日期" align="center" min-width="100" show-overflow-tooltip>
              <template #default="{row}">
                  {{$dictFormatDate(row.checkTime)}}
              </template>
          </el-table-column>
          <el-table-column prop="reviewPerson" label="审核人" min-width="80" align="center" show-overflow-tooltip>
              <template #default="{ row }">{{ $dictFindUserValue(row.reviewPerson) }}</template>
          </el-table-column>
          <el-table-column prop="reviewTime" label="审核日期" align="center" min-width="100" show-overflow-tooltip >
              <template #default="{row}">
                  {{$dictFormatDate(row.reviewTime)}}
              </template>
          </el-table-column>
      </el-table>
      <ViewRecordInfoComponent ref="viewRecordInfoComponentRef" :isPrint="true"
                               :hasPermis="['sample:sampleStatusQuery:print']" />
  </el-row>
</template>`
}