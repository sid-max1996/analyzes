export default {
    data() {
        return {};
    },
    props: {
        curPage: {
            type: Number,
            default: 1
        },
        rowCount: {
            type: Number,
            default: 1
        },
        allCount: {
            type: Number,
            default: 0
        },
        src: {
            type: String,
            default: ''
        },
        maxPagin: {
            type: Number,
            default: 4
        }
    },
    computed: {
        maxPageNum: {
            get: function() {
                let pageCount = Math.floor(this.allCount / this.rowCount);
                if (this.allCount % this.rowCount > 0) pageCount++;
                return pageCount;
            }
        },
        maxPaginNum: {
            get: function() {
                return this.maxPagin < this.maxPageNum ? this.maxPagin : this.maxPageNum;
            }
        },
        pagination: function() {
            let res = [];
            let prevBorder = this.curPage - this.maxPaginNum;
            if (prevBorder <= 0) prevBorder = 1;
            for (let i = prevBorder; i <= this.curPage - 1; i++)
                res.push({ path: this.src + `/${i}`, num: i });
            let nextBorder = this.curPage + this.maxPaginNum;
            for (let i = this.curPage; i <= nextBorder; i++) {
                if (i > this.maxPageNum) break;
                res.push({ path: this.src + `/${i}`, num: i });
            }
            return res;
        },
        prevPath: function() {
            if (this.curPage - 1 > 0)
                return this.src + `/${this.curPage-1}`;
            else return "null";
        },
        nextPath: function() {
            if (this.curPage + 1 <= this.maxPageNum)
                return this.src + `/${this.curPage+1}`;
            else return "null";
        }
    },
    methods: {
        changePage: function(pageNum) {
            console.log(`curPage = ${this.pageNum}`);
            this.$emit('changePage', pageNum);
        },
        prevPage: function() {
            this.changePage(this.curPage - 1);
        },
        nextPage: function() {
            this.changePage(this.curPage + 1);
        }
    }
}