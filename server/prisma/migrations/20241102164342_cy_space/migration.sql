-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);
