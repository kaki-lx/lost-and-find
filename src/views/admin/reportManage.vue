<template>
    <div class="container">
        <h3>举报管理</h3>
        <el-table :data="reportList" style="width: 100%">
            <el-table-column prop="id" label="举报ID" width="80"></el-table-column>
            <el-table-column prop="report_type" label="举报类型" width="100">
                <template slot-scope="scope">
                    {{ scope.row.report_type === 1 ? '失物招领' : scope.row.report_type === 2 ? '寻物启事' : '留言' }}
                </template>
            </el-table-column>
            <el-table-column prop="target_id" label="目标ID" width="100"></el-table-column>
            <el-table-column prop="reporter_nickname" label="举报人" width="120"></el-table-column>
            <el-table-column prop="reason" label="举报原因"></el-table-column>
            <el-table-column prop="status" label="处理状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 0 ? 'warning' : scope.row.status === 1 ? 'success' : 'danger'">
                        {{ scope.row.status === 0 ? '待处理' : scope.row.status === 1 ? '已处理' : '已驳回' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_date" label="举报时间" width="180"></el-table-column>
            <el-table-column prop="handle_date" label="处理时间" width="180"></el-table-column>
            <el-table-column prop="handler_nickname" label="处理人" width="120"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="handleReport(scope.row, 1)">通过</el-button>
                    <el-button v-if="scope.row.status === 0" type="danger" size="mini" @click="handleReport(scope.row, 2)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import http from '../../utils/request'
export default {
    data() {
        return {
            reportList: []
        }
    },
    methods: {
        getReportList() {
            http({
                method: 'get',
                url: 'http://127.0.0.1:3007/admin/getReportList',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.reportList = res.data.data
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        handleReport(report, status) {
            http({
                method: 'post',
                url: 'http://127.0.0.1:3007/admin/handleReport',
                headers: {
                    Authorization: this.$store.getters.getUserToken,
                },
                data: {
                    id: report.id,
                    status: status,
                    handler_id: this.$store.getters.getUserInfo.id,
                    handler_nickname: this.$store.getters.getUserInfo.nickname
                }
            }).then((res) => {
                if (res.data.status === 0) {
                    this.$message.success(res.data.message)
                    this.getReportList()
                } else {
                    this.$message.error(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
                this.$message.error('处理失败，请稍后再试！')
            })
        }
    },
    mounted() {
        this.getReportList()
    }
}
</script>

<style scoped>
.container {
    padding: 20px;
}
</style>