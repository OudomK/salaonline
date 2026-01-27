export function getPagination(meta) {
    const page = meta.page;
    const size = meta.size;
    const total = meta.total;
    const totalPages = meta.totalPages;

    return {
        page,
        size,
        total,
        totalPages,

        hasPrev: page > 1,
        hasNext: page < totalPages,

        prevPage: page > 1 ? page - 1 : 1,
        nextPage: page < totalPages ? page + 1 : totalPages,

        startItem: (page - 1) * size + 1,
        endItem: Math.min(page * size, total),
    };
}
