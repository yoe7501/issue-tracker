import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";

import Pagination from "@/app/components/Pagination";
import IssueTable, { columnNames, IssueQuery } from "./issueTable";
import { Flex } from "@radix-ui/themes";

interface Props {
  searchParams: IssueQuery,
}

const IssuesPage = async ({ searchParams }: Props) => {
  

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : "All";

  // Validate the orderBy field
  const validOrderBy = columnNames.find(column => column === searchParams.orderBy)
    ? searchParams.orderBy
    : "createdAt"; // Default to createdAt if invalid

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;



  let issues;
  let issueCount;
  if (status === "All") {
    // Fetch issues without filtering by status, but apply sorting
    issueCount = await prisma.issue.count()
    issues = await prisma.issue.findMany({
      orderBy: { [validOrderBy]: "asc" }, 
      skip: (page - 1) * pageSize,
      take: pageSize
    });
  } else {
    issueCount = await prisma.issue.count({where: {status}})
    // Fetch issues filtered by status and apply sorting
    issues = await prisma.issue.findMany({
      where: {
        status: status as Status,
      },
      orderBy: { [validOrderBy]: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    });
  }


  return (
    <Flex direction='column' gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues}/>
      
      <Pagination 
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}/>
    </Flex>
  );
};

export default IssuesPage;
