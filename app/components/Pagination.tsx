'use client'
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Props { 
    itemCount: number;
    pageSize: number;
    currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(currentPage);

    const pageCount = Math.ceil(itemCount / pageSize);
    if (pageCount <= 1) return null;

   

    const changePage = (newPage: number) => {
        if (newPage < 1 || newPage > pageCount) return; // Guard against invalid page
        const params = new URLSearchParams(searchParams.toString());
        setPage(newPage);
        params.set('page', newPage.toString());
        router.push('?' + params.toString());
    };

    return (
        <Flex align="center" gap="2">
            <Text size="2">Page {page} of {pageCount}</Text>
            <Button color="gray" variant="soft" disabled={page === 1} onClick={() => changePage(1)}>
                <DoubleArrowLeftIcon />
            </Button>
            <Button color="gray" variant="soft" disabled={page === 1} onClick={() => changePage(page - 1)}>
                <ChevronLeftIcon />
            </Button>
            <Button color="gray" variant="soft" disabled={page === pageCount} onClick={() => changePage(page + 1)}>
                <ChevronRightIcon />
            </Button>
            <Button color="gray" variant="soft" disabled={page === pageCount} onClick={() => changePage(pageCount)}>
                <DoubleArrowRightIcon />
            </Button>
        </Flex>
    );
};

export default Pagination;
