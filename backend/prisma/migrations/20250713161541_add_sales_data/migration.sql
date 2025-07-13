-- CreateTable
CREATE TABLE "SalesData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "promotion" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "dataVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SalesData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SalesData" ADD CONSTRAINT "SalesData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
