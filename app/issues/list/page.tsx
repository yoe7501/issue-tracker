import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import Link from "../../components/Link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "@/app/components/Pagination";

interface Props {
  searchParams: { 
    status: Status,
    orderBy: keyof Issue, 
    page: string,
  }; 
}

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: {
    label: string;
    value: keyof Issue;
    className?: string;
  }[] = [
    { label: "Issues", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : "All";

  // Validate the orderBy field
  const validOrderBy = columns.find(column => column.value === searchParams.orderBy)
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
    <div>
      <IssueActions />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value} className={column.className}>
                <NextLink
                  href={{ query: { ...searchParams, orderBy: column.value } }}
                >
                  {column.label}
                </NextLink>
                {column.value === searchParams.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>

                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {new Date(issue.createdAt).toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination 
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}/>
    </div>
  );
};

export default IssuesPage;
