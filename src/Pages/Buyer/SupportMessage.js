import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Pagination from "../../components/Shared/Pagination";
import toast from "react-hot-toast";

const SupportMessage = () => {
    const [support, setSupport] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        fetch(`https://server.enjoywiki.com/marketplace-server-main/support-messages?userEmail=${user?.email}`)
            .then((res) => res.json())
            .then((info) => setSupport(info.reverse()));
    }, [user?.email]);

    // Search
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredMessages = support.filter((message) => {
        const ticketId = message.ticket_id ? message.ticket_id.toLowerCase() : '';
        const userEmail = message.ticketUserEmail ? message.ticketUserEmail.toLowerCase() : '';
        const matchesSearchInput =
            ticketId.includes(searchInput.toLowerCase()) ||
            userEmail.includes(searchInput.toLowerCase());
        const matchesStatusFilter = statusFilter === "all" || message.ticketStatus === statusFilter;
        return matchesSearchInput && matchesStatusFilter;
    });

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
        setCurrentPage(1);
    };
    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
        setCurrentPage(1);
    };
    //pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentService = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleCreate = (event) => {
        event.preventDefault();

        const ticket_id = generateUniqueOrderId();
        const ticketDate = event.target.ticketDate.value;
        const ticketStatus = "pending";
        const ticketUserEmail = event.target.ticketUserEmail.value;
        const subject = event.target.subject.value;
        const message = event.target.message.value;
        const customerType = event.target.customerType.value;

        const add = {
            ticket_id,
            ticketDate,
            ticketStatus,
            ticketUserEmail,
            subject,
            message,
            customerType
        };

        const url = `https://server.enjoywiki.com/marketplace-server-main/new-support-message`;
        fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(add),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then(errorMessage => {
                        throw new Error(errorMessage);
                    });
                }
                return res.json();
            })
            .then((result) => {
                event.target.reset();
                toast.success("Adding the Successfully!")
                const modal = document.querySelector('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
                
                fetch(`https://server.enjoywiki.com/marketplace-server-main/support-messages?userEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => setSupport(info.reverse()));
            })
            .catch((error) => {
                console.error('Error creating withdrawal:', error);
                toast.error(error.message);
            });
    };
    const generateUniqueOrderId = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let ticket_id = "";
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            ticket_id += characters.charAt(randomIndex);
        }
        return ticket_id;
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    const [currentDate] = useState(formatDate(new Date()));
    const handleEditService = (event, id) => {
        event.preventDefault();
        const ticketStatus = event.target.ticketStatus.value;
        const adminMessage = event.target.adminMessage.value;

        const edit = {
            ticketStatus,
            adminMessage
        };
        const url = `https://server.enjoywiki.com/marketplace-server-main/support-message-status/${id}`;
        fetch(url, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(edit),
        })
            .then((res) => res.json())
            .then((result) => {
                event.target.reset();
                toast.success("Updated Successfully");
                const modal = document.querySelector(`.colorModal${id}`);
                if (modal) {
                    modal.classList.remove('show');
                }
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    modalBackdrop.parentNode.removeChild(modalBackdrop);
                }
                fetch(`https://server.enjoywiki.com/marketplace-server-main/support-messages?userEmail=${user?.email}`)
                    .then((res) => res.json())
                    .then((info) => setSupport(info.reverse()));
            })
            .catch((error) => {
                console.error('Error creating service:', error);
            });
    };
    return (
        <>
            <div className="blog-page-area pd-top-100 pd-bottom-100">
                <div className="page-content">
                    <div className="container-fluid">
                        <div class="col-sm-6 col-md-4 col-xl-3">
                            <td >
                                <div className="isotope-filters item-isotope-btn mb-2">
                                    <button type="button" className="button active" data-toggle="modal" data-target={`#exampleModalSupport`}>
                                    New Support Message
                                    </button>
                                </div>
                                <div class="modal fade" id={`exampleModalSupport`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">View Infomation</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <form className="comment-form" onSubmit={handleCreate}>
                                                    <div className="fadeInUp style-2 text-center">
                                                        <div className="main-title"><h3>Support Message</h3></div>
                                                    </div>
                                                    <div className="columns gap20">
                                                        <input
                                                            hidden
                                                            type="text"
                                                            name="customerType"
                                                            value="buyer"
                                                        />
                                                        <input
                                                            hidden
                                                            type="text"
                                                            name="ticketDate"
                                                            value={currentDate}
                                                        />
                                                        <input
                                                            hidden
                                                            type="text"
                                                            value="pending"
                                                            name="ticketStatus"
                                                        />
                                                        <input
                                                            hidden
                                                            type="text"
                                                            value={user?.email}
                                                            name="ticketUserEmail"
                                                        />
                                                        <fieldset className="email">
                                                            <label className="mb-2">Subject</label>
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="Subject"
                                                                className="form-control"
                                                                name="subject"
                                                            />
                                                        </fieldset>
                                                        <fieldset className="message">
                                                            <label className="mb-2">Message</label>
                                                            <textarea
                                                                required
                                                                rows={4}
                                                                name="message"
                                                                placeholder="Message"
                                                                className="form-control"
                                                            />
                                                        </fieldset>
                                                    </div>
                                                    <div className="text-center">
                                                        <button className="btn btn-success waves-effect waves-light mt-5" type="submit">
                                                            Sumbit Message
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </td>
                            
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h4 class="card-title">Support Message Lists</h4>
                                        <div className="row mb-3">
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by Ticket"
                                                    value={searchInput}
                                                    onChange={handleSearchInputChange}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <select
                                                    className="form-select"
                                                    value={statusFilter}
                                                    onChange={handleStatusFilterChange}
                                                >
                                                    <option value="all">All</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-editable table-nowrap align-middle table-edits">
                                                <thead>
                                                    <tr>
                                                        <th>Ticket ID</th>
                                                        <th>Date</th>
                                                        <th>Subject</th>
                                                        <th>Status</th>
                                                        <th>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {support === null ? (
                                                        <tr>
                                                            <td colSpan="4">Loading...</td>
                                                        </tr>
                                                    ) : currentService.map((e, index) => (
                                                        <tr key={e._id}>
                                                            <td data-field="name">{e.ticket_id}</td>
                                                            <td data-field="age">{e.ticketDate}</td>
                                                            <td data-field="age">{e.subject}</td>
                                                            <td data-field="age">{e.ticketStatus}</td>
                                                            <td >
                                                                <div className="isotope-filters item-isotope-btn">
                                                                    <button type="button" className="button active" data-toggle="modal" data-target={`#exampleModal${index}`}>
                                                                        View
                                                                    </button>
                                                                </div>
                                                                <div class="modal fade" id={`exampleModal${index}`} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div class="modal-dialog modal-lg">
                                                                        <div class="modal-content">
                                                                            <div class="modal-header">
                                                                                <h5 class="modal-title" id="exampleModalLabel">View Infomation</h5>
                                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body">
                                                                                <form className="comment-form" onSubmit={(event) => handleEditService(event, e._id)}>
                                                                                    <div className="fadeInUp style-2 text-center">
                                                                                    </div>
                                                                                    
                                                                                    <fieldset className="email">
                                                                                        <label className="mb-2">Subject</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            required
                                                                                            placeholder="Subject"
                                                                                            className="form-control"
                                                                                            name="subject"
                                                                                            defaultValue={e.subject}
                                                                                        />
                                                                                    </fieldset>
                                                                                    <fieldset className="message">
                                                                                        <label className="mb-2">User Message</label>
                                                                                        <textarea
                                                                                            disabled
                                                                                            rows={4}
                                                                                            name="message"
                                                                                            defaultValue={e.message}
                                                                                            placeholder="Message"
                                                                                            className="form-control"
                                                                                        />
                                                                                    </fieldset>
                                                                                    <fieldset className="message">
                                                                                        <label className="mb-2">Reply Message</label>
                                                                                        <textarea
                                                                                            required
                                                                                            disabled
                                                                                            rows={4}
                                                                                            name="adminMessage"
                                                                                            defaultValue={e.adminMessage}
                                                                                            placeholder="Message"
                                                                                            className="form-control"
                                                                                        />
                                                                                    </fieldset>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(support.length / itemsPerPage)}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupportMessage;
