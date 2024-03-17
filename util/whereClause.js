class WhereClause {
    constructor(base, query) {
        this.base = base;
        this.query = query;
    }
    
    search() {
        const searchWord = this.query.search ? {
            name: {
                $regex: this.query.search,
                $options: 'i'
            }
        } : {};

        this.base = this.base.find({ ...searchWord });
        return this;
    }

    filter() {
        // Example: Additional filter by category
        const filterWord = this.query.category ? { category: this.query.category } : {};

        this.base = this.base.find({ ...filterWord });
        return this;
    }

    sort() {
        const sortKey = this.query.sortBy || 'name'; // Default sort by name
        const sortOrder = this.query.sortOrder === 'desc' ? -1 : 1;

        this.base = this.base.sort({ [sortKey]: sortOrder });
        return this;
    }

    pager(resultPerPage) {
        let currentPage = 1;
        if (this.query.page) {
            currentPage = parseInt(this.query.page);
        }

        const skipValue = resultPerPage * (currentPage - 1);
        this.base = this.base.limit(resultPerPage).skip(skipValue);

        return this;
    }
}
