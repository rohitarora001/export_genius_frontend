import { useEffect, useState } from "react";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Image, LogOut } from "lucide-react";
import { imageAssociatedWithIds, RowData, statusUpdateMessage } from "@/models/images";
import UploadDialog from "@/components/Dialogs/Upload/UploadDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useSocket } from '../context/SocketContext';
import { getImages } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import ViewImage from "@/components/Dialogs/ViewImage/ViewImages";
import Loader from "@/components/Loader/index"
import Link from "next/link";
import { authRoutes } from "@/utils/constants";
export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // Adjust as needed
  const [currentPageItems, setCurrentPageItems] = useState<RowData[]>([]);
  const socket = useSocket();
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<RowData[]>([]);
  const [viewImage, setViewImage] = useState<{ visible: boolean, src: string }>({
    visible: false,
    src: ''
  });

  const columns: ColumnDef<RowData>[] = [
    {
      accessorKey: "picture",
      header: "Picture",
      cell: ({ row }: any) => {
        return <img src={row.original.picture} alt="User" style={{ width: 50, height: 50 }} />;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="text-xl"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "view",
      accessorKey: "",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const handleClick = () => {
          setViewImage({ visible: true, src: row.original.picture });
        };
        return (
          <Button
            variant="ghost"
            className="flex gap-2"
            onClick={handleClick}
          >
            <Image />
            View
          </Button>
        );
      },
    },
  ];


  const onUpload = (data: imageAssociatedWithIds[], files: Array<any>) => {
    data.forEach((data: imageAssociatedWithIds) => {
      const imageFile = files.find(file => file.name === data.originalFileName)
      const picture = URL.createObjectURL(imageFile)
      setTableData(prevTableData => [{ picture, status: 'In Queue', originalFileName: data.originalFileName, id: data.id }, ...prevTableData])
      handlePageChange(1)
    })
  }
  useEffect(() => {
    const getAllImages = async () => {
      setPageLoading(true)
      try {
        const response = await getImages()
        const data = response.data.map((el: any) => {
          return { status: el.status, picture: el.url }
        })
        setTableData(data.reverse())
        setPageLoading(false)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: error.response.data.error ?? "Something went wrong",
        });
        setPageLoading(false)
      }
    }
    getAllImages()
  }, []);
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentPageItems(tableData.slice(indexOfFirstItem, indexOfLastItem));
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.emit('register', { userId: localStorage.getItem('userId') })
      socket.on('updateStatus', (data: statusUpdateMessage) => {
        setTableData(prevTableData => {
          return prevTableData.map(tableData => {
            if (tableData.id === data.fileId) {
              return { ...tableData, status: data.status, picture: data.url };
            }
            return tableData;
          });
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('updateStatus');
      }
    };
  }, [socket]);

  // Update currentPageItems whenever currentPage or tableData changes
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentPageItems(tableData.slice(indexOfFirstItem, indexOfLastItem));
  }, [currentPage, tableData, itemsPerPage]);

  return (
    <>
      <Link href={authRoutes.signout} className="w-full flex justify-end items-center pr-5 pt-5">
        <LogOut />
      </Link>
      <div className="flex h-screen w-full items-center flex-col">
        {pageLoading ?
          <Loader loading={pageLoading} variant="scaleloader" /> :
          <div className=" rounded-md border min-h-[50vh] w-[80%] py-12 gap-4 flex items-center flex-col  justify-center">
            <UploadDialog existingImages={tableData} onUpload={(data: imageAssociatedWithIds[], files: Array<any>) => onUpload(data, files)} />
            <ViewImage onClose={() => setViewImage({ visible: false, src: '' })} isOpen={viewImage.visible} imageSrc={viewImage.src} />
            <div className="flex rounded-md md:w-[55%] w-[80%]  items-center justify-center">
              <DataTable columns={columns} data={currentPageItems} />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="border" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </Button>
              <Button disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)} variant="ghost" className="border" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        }
      </div>
    </>
  );
}
